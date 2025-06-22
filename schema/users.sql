CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  allowChangePassword TEXT DEFAULT 'false',
  name TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
