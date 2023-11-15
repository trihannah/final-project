
-- Create users table
CREATE TABLE users (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar(30) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL
);

-- Insert some example users (C in CRUD - Create)
INSERT INTO users
 (username, password_hash)
VALUES
  ('john_doe', 'hashed_password'),
  ('jane_doe', 'hashed_password');

-- Read some users (R in CRUD - Read)
SELECT * FROM users;

-- To setup the database, user, and schema:
CREATE DATABASE final_project;
CREATE USER final_project_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE final_project TO final_project_user;
\connect final_project;
CREATE SCHEMA final_project_schema AUTHORIZATION final_project_user;
