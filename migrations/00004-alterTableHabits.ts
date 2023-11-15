import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    ALTER TABLE habits
    DROP COLUMN creation_date,
    ALTER COLUMN frequency DROP NOT NULL;
  `;
}

export async function down(sql: Sql) {
  await sql`
    ALTER TABLE habits
    ADD COLUMN creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ALTER COLUMN frequency SET NOT NULL;
  `;
}
