-- Update You Database Schema
-- Core Tables: sources, articles, article_analyses, logs, oxylabs_schedules, oxylabs_schedule_runs

-- 1. Sources Table
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  listing_url TEXT NOT NULL UNIQUE,
  parser_strategy TEXT,
  active BOOLEAN DEFAULT true,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  original_url TEXT UNIQUE NOT NULL,
  canonical_url TEXT,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  published_date TIMESTAMPTZ NOT NULL,
  raw_text TEXT,
  scraped_at TIMESTAMPTZ DEFAULT now(),
  analyzed_at TIMESTAMPTZ
);

-- 0. Enable pgvector Extension (AGENTS.md Section 20)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 3. Article Analyses Table
CREATE TABLE IF NOT EXISTS public.article_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID UNIQUE REFERENCES public.articles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  sentiment_score NUMERIC NOT NULL,
  sentiment_label TEXT NOT NULL,
  bias_score NUMERIC NOT NULL,
  bias_label TEXT NOT NULL,
  left_percentage NUMERIC NOT NULL,
  center_percentage NUMERIC NOT NULL,
  right_percentage NUMERIC NOT NULL,
  confidence NUMERIC NOT NULL,
  framing_notes JSONB,
  loaded_terms JSONB,
  disclaimer TEXT,
  model TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Logs Table
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Oxylabs Schedules Table
CREATE TABLE IF NOT EXISTS public.oxylabs_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  schedule_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Oxylabs Schedule Runs Table
CREATE TABLE IF NOT EXISTS public.oxylabs_schedule_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.oxylabs_schedules(id) ON DELETE CASCADE,
  run_id TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON public.articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON public.articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_analyzed_at ON public.articles(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_article_analyses_article_id ON public.article_analyses(article_id);
CREATE INDEX IF NOT EXISTS idx_article_analyses_embedding ON public.article_analyses USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oxylabs_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oxylabs_schedule_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public Read for Website, Service Role for Pipeline
CREATE POLICY "Public sources are viewable by everyone" ON public.sources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public articles are viewable by everyone" ON public.articles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public analyses are viewable by everyone" ON public.article_analyses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public logs are viewable by authenticated" ON public.logs FOR SELECT TO authenticated USING (true);

-- RPC Function for Related Articles Search using Cosine Distance (<=>)
CREATE OR REPLACE FUNCTION match_related_articles (
  target_article_id UUID,
  target_embedding VECTOR(1536),
  match_limit INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  source_id UUID,
  original_url TEXT,
  canonical_url TEXT,
  title TEXT,
  image_url TEXT,
  published_date TIMESTAMPTZ,
  raw_text TEXT,
  scraped_at TIMESTAMPTZ,
  analyzed_at TIMESTAMPTZ,
  source_name TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.source_id,
    a.original_url,
    a.canonical_url,
    a.title,
    a.image_url,
    a.published_date,
    a.raw_text,
    a.scraped_at,
    a.analyzed_at,
    s.name AS source_name,
    1 - (an.embedding <=> target_embedding) AS similarity
  FROM public.article_analyses an
  JOIN public.articles a ON a.id = an.article_id
  LEFT JOIN public.sources s ON s.id = a.source_id
  WHERE an.embedding IS NOT NULL
    AND a.analyzed_at IS NOT NULL
    AND a.id != target_article_id
  ORDER BY an.embedding <=> target_embedding ASC
  LIMIT match_limit;
END;
$$;

