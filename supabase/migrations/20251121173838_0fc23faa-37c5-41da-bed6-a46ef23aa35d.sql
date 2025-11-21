-- Enable realtime for articles table to support live view counts
ALTER TABLE public.articles REPLICA IDENTITY FULL;

-- Add the articles table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;