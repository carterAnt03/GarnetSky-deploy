-- Migration 002: Add username column to users

ALTER TABLE users
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Backfill existing rows with a placeholder username if needed.
-- In a fresh development database there should be no rows yet, but this
-- ensures the NOT NULL constraint can be applied safely later if desired.
UPDATE users
SET username = COALESCE(username, split_part(email, '@', 1))
WHERE username IS NULL;