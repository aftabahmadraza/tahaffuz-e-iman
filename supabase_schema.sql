-- ============================================================
-- Tahaffuz-E-Iman Library — Supabase Schema
-- Supabase SQL editor me is pure file ko run karein.
-- ============================================================

create extension if not exists "uuid-ossp";

-- Table: questions (Sawal + Jawab)
create table if not exists questions (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,           -- jawab ka detailed text (HTML/markdown allowed as plain text)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table: proofs (har question ke multiple proof/reference urls)
-- type: 'text', 'image', 'pdf', 'video', 'youtube', 'instagram'
create table if not exists proofs (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references questions(id) on delete cascade,
  type text not null check (type in ('text','image','pdf','video','youtube','instagram')),
  url text,              -- image/pdf/video/youtube/instagram ka link
  label text,            -- e.g. "Fatawa Rahimiya, Jild 2, Safha 45"
  note text,             -- optional extra text/quote for type='text'
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Index for search
create index if not exists idx_questions_question on questions using gin (to_tsvector('simple', question));

-- Row Level Security
alter table questions enable row level security;
alter table proofs enable row level security;

-- Public: sabko sirf READ karne dein
create policy "Public read questions" on questions
  for select using (true);

create policy "Public read proofs" on proofs
  for select using (true);

-- Insert/Update/Delete sirf service_role (server/admin API) se hoga,
-- isliye client-side koi write policy nahi de rahe.
-- Admin panel Next.js server route se SUPABASE_SERVICE_ROLE_KEY use karke likhega.
