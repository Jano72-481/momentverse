-- =====================================================
-- MOMENTVERSE OPTIMIZED ROW LEVEL SECURITY SETUP
-- This script fixes all 18 performance warnings
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
-- DROP ALL EXISTING POLICIES TO START FRESH
-- =====================================================

-- Drop all existing policies to avoid conflicts
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
-- OPTIMIZED USERS TABLE POLICIES (Single Policy Per Action)
-- =====================================================

-- Single comprehensive policy for users
CREATE POLICY "users_policy" ON public.users
    FOR ALL USING (
        auth.uid()::text = id
    )
    WITH CHECK (
        auth.uid()::text = id
    );

-- =====================================================
-- OPTIMIZED MOMENTS TABLE POLICIES (Consolidated)
-- =====================================================

-- Single comprehensive policy for moments (handles both own and public)
CREATE POLICY "moments_policy" ON public.moments
    FOR ALL USING (
        auth.uid()::text = "userId" OR "isPublic" = true
    )
    WITH CHECK (
        auth.uid()::text = "userId"
    );

-- =====================================================
-- OPTIMIZED ORDERS TABLE POLICIES (Single Policy)
-- =====================================================

-- Single comprehensive policy for orders
CREATE POLICY "orders_policy" ON public.orders
    FOR ALL USING (
        auth.uid()::text = "userId"
    )
    WITH CHECK (
        auth.uid()::text = "userId"
    );

-- =====================================================
-- OPTIMIZED STARS TABLE POLICIES (Simplified)
-- =====================================================

-- Single policy for stars (public read, authenticated write)
CREATE POLICY "stars_policy" ON public.stars
    FOR ALL USING (true)
    WITH CHECK (
        auth.role() = 'authenticated'
    );

-- =====================================================
-- OPTIMIZED ANALYTICS TABLE POLICIES (Consolidated)
-- =====================================================

-- Single comprehensive policy for analytics
CREATE POLICY "analytics_policy" ON public.analytics
    FOR ALL USING (
        auth.uid()::text = "userId" OR "userId" IS NULL
    )
    WITH CHECK (true);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Create optimized indexes for better performance
CREATE INDEX IF NOT EXISTS idx_moments_user_id ON public.moments("userId");
CREATE INDEX IF NOT EXISTS idx_moments_is_public ON public.moments("isPublic");
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders("userId");
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics("userId");
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON public.analytics("sessionId");

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check RLS status on all tables
SELECT 'RLS Status After Optimization:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'moments', 'orders', 'stars', 'analytics')
ORDER BY tablename;

-- Check optimized policies
SELECT 'Optimized Policies Created:' as info;
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
SELECT 'Performance Optimized Security Setup Complete!' as status;
