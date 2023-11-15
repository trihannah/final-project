import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE user_progress (
      progress_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer REFERENCES users(id) ON DELETE CASCADE,
      habit_id integer REFERENCES habits(habit_id) ON DELETE CASCADE,
      progress_date DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE user_progress
  `;
}
