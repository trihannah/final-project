import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    ALTER TABLE user_progress
    ADD COLUMN progress_note TEXT;
  `;
}

export async function down(sql: Sql) {
  await sql`
    ALTER TABLE user_progress
    DROP COLUMN progress_note;
  `;
}
