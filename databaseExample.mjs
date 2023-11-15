// databaseExample.mjs
import postgres from 'postgres';
import { setEnvironmentVariables } from './util/config.mjs';

// This file is used by node.js only

setEnvironmentVariables();

const sql = postgres();

// For demonstration, fetch all users
console.log(
  await sql`
    SELECT * FROM users
  `,
);

// End the connection to the database
// Note: In a real-world application, you'll likely keep this connection persistent
await sql.end();
