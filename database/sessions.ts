import { cache } from 'react';
import { sql } from '../database/connect';
import { Session } from '../migrations/00001-createTableSessions';

export const deleteExpiredSessions = cache(async () => {
  await sql`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < now()
    `;
});

export const createSession = cache(async (userId: number, token: string) => {
  console.log(`Creating session for user ID: ${userId}`);

  const [session] = await sql<Session[]>`
      INSERT INTO sessions
        (user_id, token)
      VALUES
        (${userId}, ${token})
      RETURNING
        id,
        token,
        user_id
    `;

  await deleteExpiredSessions();

  console.log(`Session created: ${JSON.stringify(session)}`);
  return session;
});

export const deleteSessionByToken = cache(async (token: string) => {
  const [session] = await sql<{ id: number; token: string }[]>`
    DELETE FROM
      sessions
    WHERE
      sessions.token = ${token}
    RETURNING
      id,
      token
  `;

  return session;
});

export const getValidSessionByToken = cache(async (token: string) => {
  const [session] = await sql<Session[]>`
    SELECT
      sessions.id,
      sessions.token,
      sessions.user_id AS "userId"
    FROM
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
  `;

  return session;
});
