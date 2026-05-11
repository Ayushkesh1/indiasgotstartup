-- Migration: Create Grants and Events Tables for Ecosystem
-- Run this in your Supabase SQL Editor to support the new Admin Panel Ecosystem Management tabs

-- 1. Create Grants Table
CREATE TABLE IF NOT EXISTS public.grants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL, -- or title
    sector TEXT,
    category TEXT, -- Grant, Seed Funding, Accelerator, etc.
    funding_size TEXT,
    description TEXT,
    eligibility_criteria TEXT,
    target_audience TEXT,
    application_link TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE,
    status public.submission_status DEFAULT 'pending'::public.submission_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL
);

-- RLS for Grants
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public grants are viewable by everyone." ON public.grants FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert own grants." ON public.grants FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own grants." ON public.grants FOR UPDATE USING (auth.uid() = owner_id);

-- 2. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    event_type TEXT, -- Conference, Webinar, Pitch, Networking
    location TEXT, -- Online / Venue Address
    event_date TIMESTAMP WITH TIME ZONE,
    description TEXT,
    registration_link TEXT,
    banner_url TEXT,
    status public.submission_status DEFAULT 'pending'::public.submission_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL
);

-- RLS for Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public events are viewable by everyone." ON public.events FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert own events." ON public.events FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own events." ON public.events FOR UPDATE USING (auth.uid() = owner_id);

-- Optional: If you need Admin bypass policies for these tables (assuming admin logic exists)
-- Example: CREATE POLICY "Admins have full access to grants" ON public.grants FOR ALL USING (public.has_role(auth.uid(), 'admin'));
