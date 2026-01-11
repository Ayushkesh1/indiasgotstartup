
-- Create partners table for partnership management
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  partnership_type TEXT DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create career_postings table for job listings
CREATE TABLE public.career_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT DEFAULT 'Remote',
  employment_type TEXT DEFAULT 'Full-time',
  description TEXT NOT NULL,
  requirements TEXT,
  salary_range TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  career_posting_id UUID REFERENCES public.career_postings(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_queries table for get in touch submissions
CREATE TABLE public.contact_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  responded_at TIMESTAMP WITH TIME ZONE,
  response_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  twitter_handle TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_credentials table for admin login
CREATE TABLE public.admin_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Partners policies (public read, admin write)
CREATE POLICY "Active partners are viewable by everyone" ON public.partners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage partners" ON public.partners FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Career postings policies (public read active, admin write)
CREATE POLICY "Active career postings are viewable by everyone" ON public.career_postings FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage career postings" ON public.career_postings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Job applications policies (public insert, admin read/update)
CREATE POLICY "Anyone can submit job applications" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all applications" ON public.job_applications FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update applications" ON public.job_applications FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Contact queries policies (public insert, admin read/update)
CREATE POLICY "Anyone can submit contact queries" ON public.contact_queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all queries" ON public.contact_queries FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update queries" ON public.contact_queries FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Team members policies (public read active, admin write)
CREATE POLICY "Active team members are viewable by everyone" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin credentials policies (only admins)
CREATE POLICY "Admins can view credentials" ON public.admin_credentials FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage credentials" ON public.admin_credentials FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default admin credential (password: 982707875)
INSERT INTO public.admin_credentials (username, password_hash) 
VALUES ('ayushkesharwani777', '982707875');

-- Create triggers for updated_at
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_career_postings_updated_at BEFORE UPDATE ON public.career_postings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_queries_updated_at BEFORE UPDATE ON public.contact_queries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
