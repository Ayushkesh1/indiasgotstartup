
-- ===== Enums =====
DO $$ BEGIN
  CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.entity_stage AS ENUM ('idea','pre_seed','seed','series_a','series_b','series_c','growth','public');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.investor_type AS ENUM ('angel','vc','micro_vc','corporate_vc','family_office','accelerator','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.incubator_type AS ENUM ('university','government','private','corporate','accelerator','csr','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ===== Startups =====
CREATE TABLE public.startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  tagline text,
  description text,
  problem_statement text,
  solution text,
  business_model text,
  vision text,
  market_opportunity text,
  traction text,
  achievements text,
  logo_url text,
  banner_url text,
  website_url text,
  email text,
  phone text,
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  city text,
  state text,
  sector text,
  stage entity_stage,
  team_size int,
  founded_year int,
  total_funding_raised numeric,
  revenue_status text,
  is_hiring boolean NOT NULL DEFAULT false,
  looking_for_funding boolean NOT NULL DEFAULT false,
  ticket_size_min numeric,
  ticket_size_max numeric,
  incubated_at text,
  dpiit_recognized boolean NOT NULL DEFAULT false,
  gstin text,
  status submission_status NOT NULL DEFAULT 'pending',
  is_verified boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  views_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_startups_status ON public.startups(status);
CREATE INDEX idx_startups_sector ON public.startups(sector);
CREATE INDEX idx_startups_state ON public.startups(state);
CREATE INDEX idx_startups_owner ON public.startups(owner_id);

ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved startups viewable by everyone"
  ON public.startups FOR SELECT
  USING (status = 'approved');
CREATE POLICY "Owners view their own startups"
  ON public.startups FOR SELECT
  USING (auth.uid() = owner_id);
CREATE POLICY "Admins view all startups"
  ON public.startups FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can create startups"
  ON public.startups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update their own startups"
  ON public.startups FOR UPDATE
  USING (auth.uid() = owner_id);
CREATE POLICY "Admins update any startup"
  ON public.startups FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete startups"
  ON public.startups FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete their own startups"
  ON public.startups FOR DELETE
  USING (auth.uid() = owner_id);

CREATE TRIGGER startups_updated_at BEFORE UPDATE ON public.startups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Startup Team =====
CREATE TABLE public.startup_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  bio text,
  image_url text,
  linkedin_url text,
  email text,
  skills text,
  previous_experience text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_startup_team_startup ON public.startup_team(startup_id);
ALTER TABLE public.startup_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team viewable when startup approved"
  ON public.startup_team FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.startups s WHERE s.id = startup_id AND s.status = 'approved'));
CREATE POLICY "Owners manage their team"
  ON public.startup_team FOR ALL
  USING (EXISTS (SELECT 1 FROM public.startups s WHERE s.id = startup_id AND s.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.startups s WHERE s.id = startup_id AND s.owner_id = auth.uid()));
CREATE POLICY "Admins manage all team"
  ON public.startup_team FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== Startup Funding Rounds =====
CREATE TABLE public.startup_funding_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  round_name text NOT NULL,
  amount numeric,
  currency text DEFAULT 'INR',
  investors text,
  round_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_funding_startup ON public.startup_funding_rounds(startup_id);
ALTER TABLE public.startup_funding_rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Funding viewable when startup approved"
  ON public.startup_funding_rounds FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.startups s WHERE s.id = startup_id AND s.status = 'approved'));
CREATE POLICY "Owners manage funding"
  ON public.startup_funding_rounds FOR ALL
  USING (EXISTS (SELECT 1 FROM public.startups s WHERE s.id = startup_id AND s.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.startups s WHERE s.id = startup_id AND s.owner_id = auth.uid()));
CREATE POLICY "Admins manage funding"
  ON public.startup_funding_rounds FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== Incubators =====
CREATE TABLE public.incubators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  tagline text,
  about text,
  mission text,
  vision text,
  facilities text,
  logo_url text,
  banner_url text,
  website_url text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  linkedin_url text,
  twitter_url text,
  type incubator_type,
  affiliated_organization text,
  founded_year int,
  sector_focus text,
  startup_stages_supported text,
  startups_incubated int NOT NULL DEFAULT 0,
  funding_support_max numeric,
  offers_mentorship boolean NOT NULL DEFAULT false,
  offers_funding boolean NOT NULL DEFAULT false,
  is_government_backed boolean NOT NULL DEFAULT false,
  status submission_status NOT NULL DEFAULT 'pending',
  is_verified boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  views_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_incubators_status ON public.incubators(status);
CREATE INDEX idx_incubators_state ON public.incubators(state);
CREATE INDEX idx_incubators_type ON public.incubators(type);

ALTER TABLE public.incubators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved incubators viewable by everyone"
  ON public.incubators FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners view their incubators"
  ON public.incubators FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Admins view all incubators"
  ON public.incubators FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can create incubators"
  ON public.incubators FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update their incubators"
  ON public.incubators FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Admins update any incubator"
  ON public.incubators FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete their incubators"
  ON public.incubators FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Admins delete incubators"
  ON public.incubators FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER incubators_updated_at BEFORE UPDATE ON public.incubators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Incubator Programs =====
CREATE TABLE public.incubator_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incubator_id uuid NOT NULL REFERENCES public.incubators(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  eligibility text,
  duration text,
  benefits text,
  application_deadline date,
  apply_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_programs_incubator ON public.incubator_programs(incubator_id);
ALTER TABLE public.incubator_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Programs viewable when incubator approved"
  ON public.incubator_programs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.status = 'approved'));
CREATE POLICY "Owners manage programs"
  ON public.incubator_programs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.owner_id = auth.uid()));
CREATE POLICY "Admins manage programs"
  ON public.incubator_programs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== Incubator Mentors =====
CREATE TABLE public.incubator_mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incubator_id uuid NOT NULL REFERENCES public.incubators(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  expertise text,
  bio text,
  image_url text,
  linkedin_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_mentors_incubator ON public.incubator_mentors(incubator_id);
ALTER TABLE public.incubator_mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors viewable when incubator approved"
  ON public.incubator_mentors FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.status = 'approved'));
CREATE POLICY "Owners manage mentors"
  ON public.incubator_mentors FOR ALL
  USING (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.owner_id = auth.uid()));
CREATE POLICY "Admins manage mentors"
  ON public.incubator_mentors FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== Incubator Portfolio (link table) =====
CREATE TABLE public.incubator_portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incubator_id uuid NOT NULL REFERENCES public.incubators(id) ON DELETE CASCADE,
  startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(incubator_id, startup_id)
);
CREATE INDEX idx_portfolio_incubator ON public.incubator_portfolio(incubator_id);
ALTER TABLE public.incubator_portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio viewable when incubator approved"
  ON public.incubator_portfolio FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.status = 'approved'));
CREATE POLICY "Owners manage portfolio"
  ON public.incubator_portfolio FOR ALL
  USING (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.incubators i WHERE i.id = incubator_id AND i.owner_id = auth.uid()));
CREATE POLICY "Admins manage portfolio"
  ON public.incubator_portfolio FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== Investors =====
CREATE TABLE public.investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  tagline text,
  bio text,
  type investor_type,
  logo_url text,
  banner_url text,
  website_url text,
  email text,
  linkedin_url text,
  twitter_url text,
  city text,
  state text,
  country text DEFAULT 'India',
  ticket_size_min numeric,
  ticket_size_max numeric,
  preferred_sectors text,
  preferred_stages text,
  portfolio_count int NOT NULL DEFAULT 0,
  notable_investments text,
  status submission_status NOT NULL DEFAULT 'pending',
  is_verified boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  views_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_investors_status ON public.investors(status);
CREATE INDEX idx_investors_type ON public.investors(type);

ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved investors viewable by everyone"
  ON public.investors FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners view their investors"
  ON public.investors FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Admins view all investors"
  ON public.investors FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can create investors"
  ON public.investors FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update their investors"
  ON public.investors FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Admins update any investor"
  ON public.investors FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete their investors"
  ON public.investors FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Admins delete investors"
  ON public.investors FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER investors_updated_at BEFORE UPDATE ON public.investors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Storage bucket for ecosystem media (logos, banners) =====
INSERT INTO storage.buckets (id, name, public)
  VALUES ('ecosystem-media', 'ecosystem-media', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Ecosystem media is publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ecosystem-media');

CREATE POLICY "Users upload ecosystem media in own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'ecosystem-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own ecosystem media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'ecosystem-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own ecosystem media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'ecosystem-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
