-- SUPABASE DATABASE SCHEMA FOR TENTANG ITAH (UPDATED FOR TEXT IDs)

-- Drop existing tables first to clean up the UUID fields
DROP TABLE IF EXISTS active_sessions CASCADE;
DROP TABLE IF EXISTS contact CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS word_of_the_day CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS folklore CASCADE;
DROP TABLE IF EXISTS traditions CASCADE;
DROP TABLE IF EXISTS arts_culture CASCADE;
DROP TABLE IF EXISTS vocabularies CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS about CASCADE;
DROP TABLE IF EXISTS homepage CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Enable pgcrypto extension for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. HOMEPAGE TABLE
CREATE TABLE IF NOT EXISTS homepage (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    logo_1 TEXT NOT NULL,
    logo_2 TEXT NOT NULL,
    logo_3 TEXT NOT NULL,
    cta_text TEXT NOT NULL
);

-- 3. ABOUT TABLE
CREATE TABLE IF NOT EXISTS about (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- 4. LANGUAGES TABLE
CREATE TABLE IF NOT EXISTS languages (
    id TEXT PRIMARY KEY, -- e.g. 'ngaju', 'bakumpai', 'maanyan'
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    region TEXT NOT NULL
);

-- 5. VOCABULARIES TABLE
CREATE TABLE IF NOT EXISTS vocabularies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    language_id TEXT REFERENCES languages(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ARTS & CULTURE TABLE
CREATE TABLE IF NOT EXISTS arts_culture (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    origin_region TEXT NOT NULL,
    meaning TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TRADITIONS TABLE
CREATE TABLE IF NOT EXISTS traditions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    purpose TEXT NOT NULL,
    meaning TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. FOLKLORE TABLE
CREATE TABLE IF NOT EXISTS folklore (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    audio_url TEXT,
    region TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. REGIONS TABLE
CREATE TABLE IF NOT EXISTS regions (
    id TEXT PRIMARY KEY, -- e.g. 'palangkaraya', 'kapuas', 'katingan'
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    location_info TEXT NOT NULL
);

-- 10. WORD OF THE DAY TABLE
CREATE TABLE IF NOT EXISTS word_of_the_day (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    language_name TEXT NOT NULL,
    audio_url TEXT,
    display_date DATE UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    score INTEGER DEFAULT 10,
    explanation TEXT,
    category TEXT, -- Added category field
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. CONTRIBUTIONS TABLE
CREATE TABLE IF NOT EXISTS contributions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    audio_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. CONTACT TABLE
CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    email TEXT NOT NULL,
    instagram TEXT,
    facebook TEXT,
    twitter TEXT,
    dekranasda_kalteng TEXT, -- Added missing field
    address TEXT NOT NULL,
    phone TEXT,
    about_us TEXT
);

-- 15. ACTIVE SESSIONS TABLE
CREATE TABLE IF NOT EXISTS active_sessions (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Seed initial Admin Account
INSERT INTO admins (username, password)
VALUES ('admin@tentangitah.id', 'Kalimantancerah123#')
ON CONFLICT (username) DO NOTHING;
