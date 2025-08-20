-- =====================================================
-- MOMENTVERSE ROW LEVEL SECURITY SETUP
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- First, let's check current RLS status
SELECT 'Current RLS Status:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'moments', 'orders', 'stars', 'analytics')
ORDER BY tablename;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DROP EXISTING POLICIES (if any) TO AVOID CONFLICTS
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users cannot delete own profile" ON public.users;

DROP POLICY IF EXISTS "Users can view own moments" ON public.moments;
DROP POLICY IF EXISTS "Anyone can view public moments" ON public.moments;
DROP POLICY IF EXISTS "Users can create own moments" ON public.moments;
DROP POLICY IF EXISTS "Users can update own moments" ON public.moments;
DROP POLICY IF EXISTS "Users can delete own moments" ON public.moments;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users cannot delete orders" ON public.orders;

DROP POLICY IF EXISTS "Anyone can view stars" ON public.stars;
DROP POLICY IF EXISTS "Authenticated users can update star assignment" ON public.stars;
DROP POLICY IF EXISTS "Authenticated users can insert stars" ON public.stars;
DROP POLICY IF EXISTS "Users cannot delete stars" ON public.stars;

DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics;
DROP POLICY IF EXISTS "Authenticated users can update analytics" ON public.analytics;
DROP POLICY IF EXISTS "Users cannot delete analytics" ON public.analytics;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can only read their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id);

-- Users can insert their own data (for registration)
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Users cannot delete their own profile (soft delete handled by application)
CREATE POLICY "Users cannot delete own profile" ON public.users
    FOR DELETE USING (false);

-- =====================================================
-- MOMENTS TABLE POLICIES
-- =====================================================

-- Users can view their own moments
CREATE POLICY "Users can view own moments" ON public.moments
    FOR SELECT USING (auth.uid()::text = "userId");

-- Users can view public moments
CREATE POLICY "Anyone can view public moments" ON public.moments
    FOR SELECT USING ("isPublic" = true);

-- Users can create their own moments
CREATE POLICY "Users can create own moments" ON public.moments
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own moments
CREATE POLICY "Users can update own moments" ON public.moments
    FOR UPDATE USING (auth.uid()::text = "userId");

-- Users can delete their own moments
CREATE POLICY "Users can delete own moments" ON public.moments
    FOR DELETE USING (auth.uid()::text = "userId");

-- =====================================================
-- ORDERS TABLE POLICIES
-- =====================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid()::text = "userId");

-- Users can create their own orders
CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own orders
CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid()::text = "userId");

-- Users cannot delete orders (for audit trail)
CREATE POLICY "Users cannot delete orders" ON public.orders
    FOR DELETE USING (false);

-- =====================================================
-- STARS TABLE POLICIES
-- =====================================================

-- Anyone can view stars (public catalog)
CREATE POLICY "Anyone can view stars" ON public.stars
    FOR SELECT USING (true);

-- Only authenticated users can update star assignment status
CREATE POLICY "Authenticated users can update star assignment" ON public.stars
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can insert new stars
CREATE POLICY "Authenticated users can insert stars" ON public.stars
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users cannot delete stars (maintain catalog integrity)
CREATE POLICY "Users cannot delete stars" ON public.stars
    FOR DELETE USING (false);

-- =====================================================
-- ANALYTICS TABLE POLICIES
-- =====================================================

-- Users can view their own analytics
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (auth.uid()::text = "userId" OR "userId" IS NULL);

-- Anyone can insert analytics (for tracking)
CREATE POLICY "Anyone can insert analytics" ON public.analytics
    FOR INSERT WITH CHECK (true);

-- Only authenticated users can update analytics
CREATE POLICY "Authenticated users can update analytics" ON public.analytics
    FOR UPDATE USING (auth.uid()::text = "userId");

-- Users cannot delete analytics (for data integrity)
CREATE POLICY "Users cannot delete analytics" ON public.analytics
    FOR DELETE USING (false);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Create indexes for better performance with RLS
CREATE INDEX IF NOT EXISTS idx_moments_user_id ON public.moments("userId");
CREATE INDEX IF NOT EXISTS idx_moments_is_public ON public.moments("isPublic");
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders("userId");
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics("userId");
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON public.analytics("sessionId");

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check RLS status on all tables
SELECT 'RLS Status After Setup:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'moments', 'orders', 'stars', 'analytics')
ORDER BY tablename;

-- Check policies on all tables
SELECT 'Policies Created:' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Final verification
SELECT 'Security Setup Complete!' as status;
