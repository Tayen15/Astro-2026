import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);
  try {
    await sql`ALTER TABLE competitions ADD COLUMN IF NOT EXISTS min_team_members integer DEFAULT 1`;
    console.log('Column min_team_members added!');
  } catch (e: any) {
    console.error('Error:', e.message);
  }
  await sql.end();
}
main();
