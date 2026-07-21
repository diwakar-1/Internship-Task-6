import { supabaseAdmin } from "../server";
import { Article } from "../types";

export async function getArticles(limit = 20): Promise<Article[]> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `)
    .order("published_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  return (data as unknown as Article[]) || [];
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching article ${id}:`, error);
    return null;
  }

  return (data as unknown as Article) || null;
}

/**
 * Check which URLs already exist in Supabase.
 * AGENTS.md Rule 9: Query in small chunks and never pass more than 15 URLs to a single .in() filter.
 */
export async function checkUrlsExist(urls: string[]): Promise<Set<string>> {
  const existingSet = new Set<string>();
  if (!urls || urls.length === 0) return existingSet;

  const CHUNK_SIZE = 15;
  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE);
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("original_url")
      .in("original_url", chunk);

    if (error) {
      console.error("Error checking URL existence chunk:", error);
      continue;
    }

    if (data) {
      for (const row of data) {
        if (row.original_url) existingSet.add(row.original_url);
      }
    }
  }

  return existingSet;
}

/**
 * Detect pending articles that are missing analysis or embedding.
 * AGENTS.md Rule 19 & 20: Detect pending articles by LEFT JOINing `articles` to `article_analyses`.
 * An article is pending when no `article_analyses` row exists or embedding IS NULL.
 */
export async function getUnanalyzedArticles(limit = 10): Promise<Article[]> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(id, embedding)
    `)
    .order("published_date", { ascending: false });

  if (error) {
    console.error("Error fetching unanalyzed articles:", error);
    return [];
  }

  // Filter in JS for rows where analysis is missing or embedding is NULL per AGENTS.md Section 20
  const pendingArticles = (data || [])
    .filter((row: Record<string, unknown>) => {
      const analysis = row.analysis;
      if (!analysis) return true;
      if (Array.isArray(analysis)) {
        if (analysis.length === 0) return true;
        const first = analysis[0] as { id?: string; embedding?: number[] | null };
        if (!first.embedding) return true;
      } else if (typeof analysis === "object") {
        const obj = analysis as { id?: string; embedding?: number[] | null };
        if (!obj.embedding) return true;
      }
      return false;
    })
    .slice(0, limit);

  return pendingArticles as unknown as Article[];
}

export async function insertArticles(
  articles: Array<Omit<Article, "id" | "scraped_at" | "analyzed_at">>
): Promise<Article[]> {
  if (!articles || articles.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from("articles")
    .insert(articles as unknown as Record<string, unknown>[])
    .select();

  if (error) {
    console.error("Error inserting articles:", error);
    return [];
  }

  return (data as unknown as Article[]) || [];
}

/**
 * Find related articles using pgvector cosine distance (<=>) search via match_related_articles RPC.
 * AGENTS.md Section 20: Query article_analyses joined to articles and sources, filter to non-null embeddings,
 * analyzed articles, excluding current article, order by cosine distance (<=>) limit 5.
 */
export async function getRelatedArticles(
  articleId: string,
  embedding?: number[] | string | null,
  limit = 5
): Promise<Article[]> {
  if (!articleId) return [];

  let vectorArr: number[] = [];
  if (typeof embedding === "string") {
    try {
      vectorArr = JSON.parse(embedding);
    } catch {
      vectorArr = [];
    }
  } else if (Array.isArray(embedding)) {
    vectorArr = embedding;
  }

  if (vectorArr.length > 0) {
    const vectorString = `[${vectorArr.join(",")}]`;
    const { data, error } = await supabaseAdmin.rpc("match_related_articles", {
      target_article_id: articleId,
      target_embedding: vectorString,
      match_limit: limit,
    });

    if (error) {
      console.warn(`[getRelatedArticles] RPC match_related_articles warning for ${articleId}:`, error.message);
    } else if (data && data.length > 0) {
      return (data as Array<{
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
        source_name: string;
        similarity: number;
      }>).map((item) => ({
        id: item.id,
        source_id: item.source_id,
        original_url: item.original_url,
        canonical_url: item.canonical_url,
        title: item.title,
        image_url: item.image_url,
        published_date: item.published_date,
        raw_text: item.raw_text,
        scraped_at: item.scraped_at,
        analyzed_at: item.analyzed_at,
        source: {
          id: item.source_id,
          name: item.source_name || "News",
          listing_url: "",
          parser_strategy: null,
          active: true,
          logo_url: null,
          created_at: "",
        },
      }));
    }
  }

  // Fallback: Fetch latest analyzed articles excluding current article if RPC unavailable or no vector match
  const { data: fallbackData, error: fallbackError } = await supabaseAdmin
    .from("articles")
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `)
    .neq("id", articleId)
    .not("analyzed_at", "is", null)
    .order("published_date", { ascending: false })
    .limit(limit);

  if (fallbackError) {
    console.error("Error fetching fallback related articles:", fallbackError);
    return [];
  }

  return (fallbackData as unknown as Article[]) || [];
}


