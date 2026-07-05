CREATE TABLE IF NOT EXISTS public.widgets (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  value text NOT NULL CHECK (char_length(value) BETWEEN 1 AND 120),
  source text NOT NULL CHECK (char_length(source) BETWEEN 1 AND 120),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read private widgets" ON public.widgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert private widgets" ON public.widgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update private widgets" ON public.widgets FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete private widgets" ON public.widgets FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS widgets_user_id_idx ON public.widgets(user_id);
