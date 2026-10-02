-- ================================================================
-- GSFCU GOT TALENT 2026 - SUPABASE DATABASE & STORAGE SCHEMA
-- ================================================================
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  enrollment_no TEXT NOT NULL,
  school_dept TEXT NOT NULL,
  semester TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  participation_type TEXT NOT NULL DEFAULT 'Solo',
  performance_name TEXT NOT NULL,
  num_participants TEXT NOT NULL DEFAULT '1',
  description TEXT,
  track_url TEXT,
  track_file_name TEXT,
  drive_link TEXT,
  status TEXT NOT NULL DEFAULT 'Registered',
  checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_registrations_category ON public.registrations(category);
CREATE INDEX IF NOT EXISTS idx_registrations_enrollment ON public.registrations(enrollment_no);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts (student registrations)
CREATE POLICY "Allow public submissions" 
ON public.registrations FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow public reading (for student verification & admin portal)
CREATE POLICY "Allow public select" 
ON public.registrations FOR SELECT 
TO anon, authenticated
USING (true);

-- Allow updates (for admin check-in and status updates)
CREATE POLICY "Allow public update for check-ins" 
ON public.registrations FOR UPDATE 
TO anon, authenticated
USING (true);

-- 4. Storage Bucket for Audio/Media Tracks
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-tracks', 'audio-tracks', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: allow anyone to upload audio tracks
CREATE POLICY "Allow public upload to audio-tracks" 
ON storage.objects FOR INSERT 
TO anon, authenticated
WITH CHECK (bucket_id = 'audio-tracks');

-- Storage RLS: allow public read of audio tracks
CREATE POLICY "Allow public read from audio-tracks" 
ON storage.objects FOR SELECT 
TO anon, authenticated
USING (bucket_id = 'audio-tracks');
