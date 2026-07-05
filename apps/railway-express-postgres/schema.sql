CREATE TABLE IF NOT EXISTS widgets (
  id text PRIMARY KEY,
  title text NOT NULL,
  value text NOT NULL,
  source text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
