import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import postgres from 'postgres';

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    await sql`CREATE TABLE IF NOT EXISTS "otp_codes" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" text NOT NULL,
      "code" text NOT NULL,
      "name" text,
      "password" text,
      "expires_at" timestamp NOT NULL,
      "used_at" timestamp,
      "created_at" timestamp DEFAULT now()
    )`;
    console.log('otp_codes table created');

    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables:', tables.map(t => t.table_name).join(', '));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
  await sql.end();
}
main();
