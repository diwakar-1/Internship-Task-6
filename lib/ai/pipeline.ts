import { getUnanalyzedArticles, getArticleById } from "@/lib/supabase/queries/articles";
import { saveArticleAnalysis, saveArticleEmbedding } from "@/lib/supabase/queries/analyses";
import { insertLog } from "@/lib/supabase/queries/logs";
import { analyzeArticleWithAI, generateEmbeddingWithAI } from "./analyzer";
import { Json } from "@/lib/supabase/types";

export interface AiPipelineOptions {
  articleIds?: string[];
  limit?: number;
  batchSize?: number;
}

export interface AiPipelineSummary {
  status: "completed" | "failed";
  articlesPending: number;
  articlesAnalyzed: number;
  articlesFailed: number;
  batchesProcessed: number;
  totalDurationMs: number;
}

export async function runAiAnalysisPipeline(
  options: AiPipelineOptions = {}
): Promise<AiPipelineSummary> {
  const startTime = Date.now();
  const limit = options.limit || 50;
  const batchSize = options.batchSize || 5;

  console.log("==================================================");
  console.log("🤖 [AI Pipeline] Starting AI Article Analysis & Vector Embedding run");
  console.log("==================================================");

  let targetArticles = [];

  if (options.articleIds && options.articleIds.length > 0) {
    console.log(`🎯 [AI Pipeline] Target specified for ${options.articleIds.length} article ID(s)`);
    for (const id of options.articleIds) {
      const art = await getArticleById(id);
      if (art) targetArticles.push(art);
    }
  } else {
    // Pending-analysis and embedding check per AGENTS.md Section 19 & 20
    targetArticles = await getUnanalyzedArticles(limit);
  }

  if (targetArticles.length === 0) {
    console.log("ℹ️ [AI Pipeline] No pending articles require AI analysis or embedding generation.");
    return {
      status: "completed",
      articlesPending: 0,
      articlesAnalyzed: 0,
      articlesFailed: 0,
      batchesProcessed: 0,
      totalDurationMs: Date.now() - startTime,
    };
  }

  console.log(`📋 [AI Pipeline] Found ${targetArticles.length} pending article(s) to process (Batch Size: ${batchSize})`);

  let totalAnalyzed = 0;
  let totalFailed = 0;
  let batchesProcessed = 0;

  // Process in configurable batches to avoid timeouts (AGENTS.md Section 19)
  for (let i = 0; i < targetArticles.length; i += batchSize) {
    const batch = targetArticles.slice(i, i + batchSize);
    batchesProcessed++;

    console.log(`\n⚙️ [Batch ${batchesProcessed}] Processing ${batch.length} article(s)...`);

    for (const article of batch) {
      console.log(`  ➔ Processing article: "${article.title.substring(0, 50)}..." (ID: ${article.id})`);

      const existingAnalysis = article.analysis;

      // 1. Generate text-embedding-3-small embedding vector (Section 20)
      const embeddingText = `${article.title}\n\n${(article.raw_text || "").substring(0, 4000)}`;
      let embedding: number[] | null = null;
      try {
        embedding = await generateEmbeddingWithAI(embeddingText);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Embedding generation error";
        console.warn(`  ⚠️ Embedding generation failed for article ${article.id}: ${msg}`);
      }

      // 2. Backfill embedding if article_analyses row already exists but missing embedding (Section 20)
      if (existingAnalysis && existingAnalysis.id) {
        if (embedding) {
          const saved = await saveArticleEmbedding(article.id, embedding);
          if (saved) {
            totalAnalyzed++;
            console.log(`  ✓ Successfully backfilled embedding for article ${article.id}`);
          } else {
            totalFailed++;
            console.error(`  ❌ Failed backfilling embedding for article ${article.id}`);
          }
        } else {
          totalFailed++;
        }
        continue;
      }

      // 3. Full AI analysis call for new articles
      let analysisResult = null;
      let attempts = 0;
      const maxAttempts = 2; // Retry once if output fails per Section 19 rule

      while (attempts < maxAttempts && !analysisResult) {
        attempts++;
        try {
          analysisResult = await analyzeArticleWithAI(
            article.title,
            article.raw_text || article.title,
            article.source?.name
          );
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "AI analysis error";
          console.warn(`  ⚠️ Attempt ${attempts} failed for article ${article.id}: ${msg}`);
        }
      }

      if (!analysisResult) {
        totalFailed++;
        console.error(`  ❌ Article ${article.id} failed AI analysis after ${maxAttempts} attempts.`);
        continue;
      }

      // Save analysis & embedding to article_analyses and set analyzed_at on articles (Section 20)
      const saved = await saveArticleAnalysis({
        article_id: article.id,
        ...analysisResult,
        embedding: embedding || undefined,
      });

      if (saved) {
        totalAnalyzed++;
        console.log(`  ✓ Successfully saved analysis & embedding for article ${article.id} (Framing: ${saved.bias_label})`);
      } else {
        totalFailed++;
        console.error(`  ❌ Failed saving analysis row for article ${article.id} to Supabase.`);
      }
    }

    console.log(`📊 [Batch ${batchesProcessed} Completed] Analyzed/Embedded: ${totalAnalyzed}, Failed: ${totalFailed}`);
  }

  const durationMs = Date.now() - startTime;

  const summary: AiPipelineSummary = {
    status: "completed",
    articlesPending: targetArticles.length,
    articlesAnalyzed: totalAnalyzed,
    articlesFailed: totalFailed,
    batchesProcessed,
    totalDurationMs: durationMs,
  };

  // Emit system log entry to Supabase logs table
  await insertLog("info", "AI article analysis & embedding pipeline execution completed", summary as unknown as Json);

  console.log("\n==================================================");
  console.log("🏁 [AI Pipeline Completed Summary]");
  console.log(JSON.stringify(summary, null, 2));
  console.log("==================================================\n");

  return summary;
}

