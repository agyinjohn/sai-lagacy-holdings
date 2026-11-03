-- Registrations table for The Courtyard by Sai (prototype).
-- Mirrors src/lib/storage/schema.ts. Safe to run more than once.
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY,
  ref text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL,
  date text NOT NULL,
  pathway text NOT NULL,
  category text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  location text NOT NULL,
  detail text NOT NULL,
  organisation text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  consent boolean NOT NULL CHECK (consent = true),
  consent_notice_version text NOT NULL,
  source text NOT NULL
);
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations (created_at);
CREATE INDEX IF NOT EXISTS registrations_pathway_idx ON registrations (pathway);
