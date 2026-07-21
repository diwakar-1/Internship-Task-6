import { supabaseAdmin } from "../server";
import { ArticleAnalysis } from "../types";

export async function saveArticleAnalysis(
  analysis: Omit<ArticleAnalysis, "id" | "created_at">
): Promise<ArticleAnalysis | null> {
  // 1. Insert analysis into article_analyses table
  const { data, error } = await supabaseAdmin
    .from("article_analyses")
    .insert(analysis)
    .select()
    .single();

  if (error) {
    console.error("Error inserting article analysis:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return null;
  }

  // 2. Mark analyzed_at timestamp on articles table ONLY after valid analysis (and embedding if present) is saved
  if (analysis.embedding) {
    const { error: updateError } = await supabaseAdmin
      .from("articles")
      .update({ analyzed_at: new Date().toISOString() })
      .eq("id", analysis.article_id);

    if (updateError) {
      console.error(`Error updating analyzed_at for article ${analysis.article_id}:`, updateError);
    }
  }

  return data as ArticleAnalysis;
}

export async function saveArticleEmbedding(
  articleId: string,
  embedding: number[]
): Promise<boolean> {
  // 1. Update embedding on existing article_analyses row
  const { error } = await supabaseAdmin
    .from("article_analyses")
    .update({ embedding })
    .eq("article_id", articleId);

  if (error) {
    console.error(`Error updating embedding for article ${articleId}:`, error);
    return false;
  }

  // 2. Mark analyzed_at timestamp on articles table ONLY after embedding is saved
  const { error: updateError } = await supabaseAdmin
    .from("articles")
    .update({ analyzed_at: new Date().toISOString() })
    .eq("id", articleId);

  if (updateError) {
    console.error(`Error updating analyzed_at for article ${articleId}:`, updateError);
  }

  return true;
}

export async function getAnalysisByArticleId(articleId: string): Promise<ArticleAnalysis | null> {
  const { data, error } = await supabaseAdmin
    .from("article_analyses")
    .select("*")
    .eq("article_id", articleId)
    .single();

  if (error) {
    console.error(`Error fetching analysis for article ${articleId}:`, error);
    return null;
  }

  return (data as ArticleAnalysis) || null;
}
