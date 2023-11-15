import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE habits (
      habit_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer REFERENCES users(id) ON DELETE CASCADE,
      habit_name varchar(255) NOT NULL,
      habit_description text,
      creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
      frequency varchar(50) NOT NULL
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE habits
  `;
}
