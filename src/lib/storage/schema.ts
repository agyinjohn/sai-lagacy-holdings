/**
 * Postgres schema for registrations. Applied automatically (idempotent) the first time the
 * adapter is used. The same SQL lives in db/schema.sql for teams that prefer to run migrations
 * themselves. A test keeps the two identical.
 */
export const REGISTRATIONS_SCHEMA = `CREATE TABLE IF NOT EXISTS registrations (
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
`;
