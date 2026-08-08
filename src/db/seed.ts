import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  const sql = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    ssl: { rejectUnauthorized: false },
    idle_timeout: 30,
  });

  console.log('🌱 Seeding database...');

  const { default: astroData } = await import('../../data/astro-data.json', {
    with: { type: 'json' },
  }) as any;
  const data = astroData;

  // Seed competitions
  for (const comp of data.competitions) {
    const firstPrize = comp.prizes.find((p: any) => p.label === 'Juara 1')?.value || '';
    const secondPrize = comp.prizes.find((p: any) => p.label === 'Juara 2')?.value || '';
    const thirdPrize = comp.prizes.find((p: any) => p.label === 'Juara 3')?.value || '';
    // Sequential inserts keep the seed deterministic and avoid overwhelming the connection pool
    // oxlint-disable-next-line no-await-in-loop
    await sql`
      INSERT INTO competitions (
        id, title, category, tagline, description, fee,
        max_slots, filled_slots, schedule_date, location,
        prizes_first, prizes_second, prizes_third, prizes,
        rules_summary, rulebook_url, contact_name, contact_whatsapp
      ) VALUES (
        ${comp.id}, ${comp.title}, ${comp.category}, ${comp.tagline},
        ${comp.description}, ${comp.fee}, ${comp.maxSlots}, ${comp.filledSlots},
        ${new Date(comp.scheduleDate)}, ${comp.location},
        ${firstPrize}, ${secondPrize}, ${thirdPrize},
        ${JSON.stringify(comp.prizes)},
        ${JSON.stringify(comp.rulesSummary)}, ${comp.rulebookUrl},
        ${comp.contactPerson.name}, ${comp.contactPerson.whatsapp}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`✅ Seeded ${data.competitions.length} competitions`);

  // Seed FAQs
  for (let i = 0; i < data.faqs.length; i++) {
    const faq = data.faqs[i];
    // oxlint-disable-next-line no-await-in-loop
    await sql`
      INSERT INTO faqs (question, answer, sort_order)
      VALUES (${faq.q}, ${faq.a}, ${i})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`✅ Seeded ${data.faqs.length} FAQs`);

  // Seed admin user
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'password';

  // Check if admin already exists in users table
  const [existingAdmin] = await sql`
    SELECT id FROM users WHERE email = ${adminEmail}
  `;

  if (!existingAdmin) {
    // Create admin via Better Auth signUpEmail, then set role to admin
    const { auth } = await import('@/src/server/auth');
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin ASTRO',
      },
    });

    const userId = (result as any)?.user?.id;

    if (userId) {
      await sql`
        INSERT INTO users (id, email, name, role, email_verified, updated_at)
        VALUES (${userId}, ${adminEmail}, 'Admin ASTRO', 'admin', true, now())
        ON CONFLICT (id) DO NOTHING
      `;
      console.log(`✅ Admin user ready:`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('');
      console.log('⚠️  Could not create admin user automatically.');
      console.log('📝 Please create manually:');
      console.log(`   1. Register via the site with email: ${adminEmail}`);
      console.log(`   2. Set role to admin in the users table:`);
      console.log(`      UPDATE users SET role = 'admin' WHERE email = '${adminEmail}';`);
    }
  } else {
    console.log(`⏭️  Admin user already exists: ${adminEmail}`);
  }

  await sql.end();
  console.log('🎉 Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
