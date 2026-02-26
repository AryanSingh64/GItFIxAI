-- ═══════════════════════════════════════════════════════════════════
-- Supabase Database Schema for Autonomous CI/CD Healing Agent
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- Table: analysis_runs
-- Stores metadata for each CI/CD healing analysis run
CREATE TABLE IF NOT EXISTS analysis_runs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    repo_url TEXT NOT NULL,
    team_name TEXT DEFAULT '',
    leader_name TEXT DEFAULT '',
    branch_name TEXT DEFAULT '',
    status TEXT DEFAULT 'UNKNOWN',       -- PASSED, PARTIAL, FAILED
    total_failures INTEGER DEFAULT 0,
    fixes_applied INTEGER DEFAULT 0,
    remaining_issues INTEGER DEFAULT 0,
    duration TEXT DEFAULT '',
    score INTEGER DEFAULT 0,
    pr_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: file_fixes
-- Stores individual code fixes applied during a run
CREATE TABLE IF NOT EXISTS file_fixes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    run_id UUID REFERENCES analysis_runs(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    fix_type TEXT DEFAULT '',             -- LINTING, SYNTAX, LOGIC, etc.
    line_number INTEGER DEFAULT 0,
    commit_message TEXT DEFAULT '',
    status TEXT DEFAULT 'FIXED',
    method TEXT DEFAULT 'heuristic',      -- heuristic, ai
    agent TEXT DEFAULT 'Fixer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: user_profiles (optional - extends Supabase auth.users)
-- Stores additional user metadata beyond what Supabase Auth provides
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    github_username TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Indexes ═══
CREATE INDEX IF NOT EXISTS idx_analysis_runs_created_at ON analysis_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_file_fixes_run_id ON file_fixes(run_id);

-- ═══ Row Level Security (RLS) ═══
-- Enable RLS on all tables
ALTER TABLE analysis_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_fixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow the service role (backend) to do everything
-- These policies allow the backend (using service_role key) full access
CREATE POLICY "Service role full access on analysis_runs"
    ON analysis_runs FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access on file_fixes"
    ON file_fixes FOR ALL
    USING (true)
    WITH CHECK (true);

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Auto-create profile on signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
