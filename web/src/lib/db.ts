import { neon } from "@neondatabase/serverless";

function firstNonEmpty(...vals: Array<string | undefined>): string | undefined {
  return vals.find((v) => typeof v === "string" && v.length > 0);
}

const connectionString = firstNonEmpty(
  process.env.DATABASE_URL,
  process.env.POSTGRES_URL,
);

// `null` when the database isn't configured (e.g. local dev) — callers fall
// back to logging so nothing is lost.
export const sql = connectionString ? neon(connectionString) : null;

// Idempotent table provisioning. Cached so the DDL runs at most once per
// warm instance rather than on every request. The Neon integration's
// connection strings are write-only ("Sensitive"), so this is how the
// schema gets created — on the first request in a deployed environment.
let ensured: Promise<void> | null = null;
export function ensureSubscribersTable(
  db: NonNullable<typeof sql>,
): Promise<void> {
  ensured ??= db`
    CREATE TABLE IF NOT EXISTS subscribers (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `.then(() => undefined);
  return ensured;
}
