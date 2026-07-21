export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Source {
  id: string;
  name: string;
  listing_url: string;
  parser_strategy: string | null;
  active: boolean;
  logo_url: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  source_id: string;
  original_url: string;
  canonical_url: string | null;
  title: string;
  image_url: string;
  published_date: string;
  raw_text: string | null;
  scraped_at: string;
  analyzed_at: string | null;
  source?: Source;
  analysis?: ArticleAnalysis;
}

export interface ArticleAnalysis {
  id: string;
  article_id: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: "positive" | "neutral" | "negative" | string;
  bias_score: number;
  bias_label: "left" | "center" | "right" | "mixed" | "unclear" | string;
  left_percentage: number;
  center_percentage: number;
  right_percentage: number;
  confidence: number;
  framing_notes: Json | null;
  loaded_terms: Json | null;
  disclaimer: string | null;
  model: string;
  embedding?: number[] | null;
  created_at: string;
}

export interface Log {
  id: string;
  level: "info" | "warn" | "error" | string;
  message: string;
  details: Json | null;
  created_at: string;
}

export interface OxylabsSchedule {
  id: string;
  source_id: string;
  schedule_id: string;
  created_at: string;
  updated_at: string;
}

export interface OxylabsScheduleRun {
  id: string;
  schedule_id: string;
  run_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      sources: {
        Row: Source;
        Insert: Omit<Source, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Source, "id">>;
      };
      articles: {
        Row: Article;
        Insert: Omit<Article, "id" | "scraped_at" | "analyzed_at"> & {
          id?: string;
          scraped_at?: string;
          analyzed_at?: string | null;
        };
        Update: Partial<Omit<Article, "id">>;
      };
      article_analyses: {
        Row: ArticleAnalysis;
        Insert: Omit<ArticleAnalysis, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<ArticleAnalysis, "id">>;
      };
      logs: {
        Row: Log;
        Insert: Omit<Log, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Log, "id">>;
      };
      oxylabs_schedules: {
        Row: OxylabsSchedule;
        Insert: Omit<OxylabsSchedule, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<OxylabsSchedule, "id">>;
      };
      oxylabs_schedule_runs: {
        Row: OxylabsScheduleRun;
        Insert: Omit<OxylabsScheduleRun, "id" | "started_at"> & { id?: string; started_at?: string };
        Update: Partial<Omit<OxylabsScheduleRun, "id">>;
      };
    };
  };
}
