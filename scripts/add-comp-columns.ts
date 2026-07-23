import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);
  try {
    await sql`ALTER TABLE competitions ADD COLUMN IF NOT EXISTS type text DEFAULT 'individual'`;
    await sql`ALTER TABLE competitions ADD COLUMN IF NOT EXISTS max_team_members integer DEFAULT 1`;
    await sql`ALTER TABLE competitions ADD COLUMN IF NOT EXISTS members_required text DEFAULT 'optional'`;
    console.log('Columns added!');
    const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'competitions' ORDER BY ordinal_position`;
    console.log('Columns:', cols.map((c: any) => c.column_name).join(', '));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
  await sql.end();
}
main();
