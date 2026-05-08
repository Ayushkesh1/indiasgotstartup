-- 1. Add fields to existing team tables
ALTER TABLE public.startup_team ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.startup_team ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE public.startup_team ADD COLUMN IF NOT EXISTS city text;

ALTER TABLE public.incubator_mentors ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.incubator_mentors ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE public.incubator_mentors ADD COLUMN IF NOT EXISTS city text;

-- 2. Job Postings Table
CREATE TABLE public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type text NOT NULL, -- 'startup', 'incubator', 'investor'
  entity_id uuid NOT NULL,
  role_title text NOT NULL,
  department text,
  work_mode text,
  city text,
  experience text,
  skills text,
  description text,
  apply_link text,
  contact_email text,
  deadline date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Job postings viewable by everyone"
  ON public.job_postings FOR SELECT USING (true);
CREATE POLICY "Owners manage their job postings"
  ON public.job_postings FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 3. Connections Table
CREATE TABLE public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their connections"
  ON public.connections FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create connections"
  ON public.connections FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update connection status"
  ON public.connections FOR UPDATE
  USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

CREATE POLICY "Users can delete connections"
  ON public.connections FOR DELETE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 4. Messages Table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can update message read status"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- 5. Track profile type explicitly
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_role text DEFAULT 'user';
