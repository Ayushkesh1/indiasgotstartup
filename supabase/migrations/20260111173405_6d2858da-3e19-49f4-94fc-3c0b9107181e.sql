-- Allow public access to admin_credentials for login verification
CREATE POLICY "Allow login verification" ON public.admin_credentials 
FOR SELECT 
USING (true);