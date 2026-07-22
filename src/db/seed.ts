import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

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
    await sql`
      INSERT INTO competitions (
        id, title, category, tagline, description, fee,
        max_slots, filled_slots, schedule_date, location,
        prizes_first, prizes_second, prizes_third,
        rules_summary, rulebook_url, contact_name, contact_whatsapp
      ) VALUES (
        ${comp.id}, ${comp.title}, ${comp.category}, ${comp.tagline},
        ${comp.description}, ${comp.fee}, ${comp.maxSlots}, ${comp.filledSlots},
        ${new Date(comp.scheduleDate)}, ${comp.location},
        ${comp.prizes.first}, ${comp.prizes.second}, ${comp.prizes.third},
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
    await sql`
      INSERT INTO faqs (question, answer, sort_order)
      VALUES (${faq.q}, ${faq.a}, ${i})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`✅ Seeded ${data.faqs.length} FAQs`);

  // Seed admin user
  // Create admin via direct API call to Supabase Auth admin endpoint
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'password';

  // Check if admin already exists in users table
  const [existingAdmin] = await sql`
    SELECT id FROM users WHERE email = ${adminEmail}
  `;

  if (!existingAdmin) {
    // Try Supabase Auth admin API with service role
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let userId: string | null = null;

    if (serviceKey) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
          }),
        });
        const json = await res.json();
        if (res.ok && json.id) {
          userId = json.id;
          console.log(`✅ Auth user created via admin API`);
        } else {
          console.log(`⚠️  Admin API: ${json.msg || json.error || 'unknown error'}`);
        }
      } catch (err: any) {
        console.log(`⚠️  Admin API failed: ${err.message}`);
      }
    }

    if (!userId) {
      // Fallback: create auth user via signup
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { data } = await supabaseAdmin.auth.signUp({
        email: `astro-admin-${Date.now()}@temp.com`, // bypass email validation
        password: adminPassword,
      });
      if (data?.user) {
        userId = data.user.id;
        // Update email in auth.users table directly
        await sql`
          UPDATE auth.users SET email = ${adminEmail} WHERE id = ${userId}
        `;
        console.log(`✅ Auth user created via signUp fallback`);
      }
    }

    if (userId) {
      await sql`
        INSERT INTO users (id, email, name, role)
        VALUES (${userId}, ${adminEmail}, 'Admin ASTRO', 'admin')
        ON CONFLICT (id) DO NOTHING
      `;
      console.log(`✅ Admin user ready:`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('');
      console.log('⚠️  Could not create auth user automatically.');
      console.log('📝 Please create manually in Supabase Dashboard:');
      console.log(`   1. Go to Authentication → Users → Add User`);
      console.log(`   2. Email: ${adminEmail} / Password: ${adminPassword}`);
      console.log(`   3. Then run this SQL in Supabase SQL Editor:`);
      console.log(`      INSERT INTO users (id, email, name, role)`);
      console.log(`      VALUES ('<uuid-from-auth>', '${adminEmail}', 'Admin ASTRO', 'admin');`);
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
