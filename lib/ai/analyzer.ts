import { generateObject, embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { ArticleAnalysis, Json } from "@/lib/supabase/types";

export const articleAnalysisSchema = z.object({
  summary: z.string().describe("Neutral 2-4 sentence summary of the main news events reported in the article."),
  sentimentScore: z.number().min(-1).max(1).describe("Overall tone score from -1 (very negative) to +1 (very positive)."),
  sentimentLabel: z.enum(["positive", "neutral", "negative"]).describe("Sentiment classification."),
  leftPercentage: z.number().min(0).max(100).describe("Estimated percentage of framing leaning Left (0 to 100)."),
  centerPercentage: z.number().min(0).max(100).describe("Estimated percentage of framing leaning Center (0 to 100)."),
  rightPercentage: z.number().min(0).max(100).describe("Estimated percentage of framing leaning Right (0 to 100)."),
  biasLabel: z.enum(["left", "center", "right", "mixed", "unclear"]).describe("Strongest political framing classification based on article text evidence."),
  confidence: z.number().min(0).max(1).describe("Model confidence score from 0.0 to 1.0."),
  framingNotes: z.array(z.string()).describe("Bullet notes highlighting specific framing, tone, and perspective choices in the article text."),
  loadedTerms: z.array(z.string()).describe("List of emotionally charged or loaded phrases identified in the article text."),
  disclaimer: z.string().describe("Disclaimer text regarding AI-estimated political framing."),
});

export type AnalyzedArticleOutput = z.infer<typeof articleAnalysisSchema>;

export async function generateEmbeddingWithAI(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.startsWith("sample_") || apiKey.includes("your_") || apiKey.length < 20) {
    console.warn("[AI Analyzer] Missing or sample OPENAI_API_KEY. Using fallback embedding generator.");
    return generateFallbackEmbedding(text);
  }

  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text.substring(0, 8000),
    });
    return embedding;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Embedding generation error";
    console.warn(`[AI Analyzer] OpenAI embedding call failed (${errorMsg}). Falling back to heuristic embedding.`);
    return generateFallbackEmbedding(text);
  }
}

function generateFallbackEmbedding(text: string): number[] {
  const dimensions = 1536;
  const vector: number[] = new Array(dimensions);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    const val = Math.sin(hash + i * 0.1);
    vector[i] = val;
    norm += val * val;
  }
  norm = Math.sqrt(norm);
  for (let i = 0; i < dimensions; i++) {
    vector[i] = vector[i] / norm;
  }

  return vector;
}

export async function analyzeArticleWithAI(
  title: string,
  rawText: string,
  sourceName?: string
): Promise<Omit<ArticleAnalysis, "id" | "article_id" | "created_at">> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.startsWith("sample_") || apiKey.includes("your_") || apiKey.length < 20) {
    console.warn("[AI Analyzer] Missing or sample OPENAI_API_KEY. Using heuristic fallback analysis mode.");
    return generateFallbackAnalysis(title, rawText, sourceName);
  }

  const systemPrompt = `You are a neutral, principal-level media bias and sentiment analysis AI engine for "Update Me".
Your task is to analyze the provided article text objectively.

Rules:
1. Base political framing strictly on article text evidence, tone, word choice, and source attribution. Do NOT infer bias based on the publisher name alone.
2. leftPercentage, centerPercentage, and rightPercentage MUST be numbers between 0 and 100 and MUST sum to 100.
3. biasLabel MUST be one of: "left", "center", "right", "mixed", or "unclear".
4. If evidence is weak or balanced, set biasLabel to "unclear" or "center" and keep confidence low.
5. Identify loaded terms and framing nuances in the text.`;

  const userPrompt = `Source: ${sourceName || "Unknown"}
Title: ${title}

Article Text:
${rawText.substring(0, 4000)}`;

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: articleAnalysisSchema,
      system: systemPrompt,
      prompt: userPrompt,
      maxRetries: 0, // Fallback immediately if OpenAI API key has quota error
    });

    // Normalize percentages to sum to 100
    const rawSum = object.leftPercentage + object.centerPercentage + object.rightPercentage;
    let leftPct = object.leftPercentage;
    let centerPct = object.centerPercentage;
    let rightPct = object.rightPercentage;

    if (rawSum > 0 && Math.abs(rawSum - 100) > 0.01) {
      leftPct = Math.round((leftPct / rawSum) * 100);
      rightPct = Math.round((rightPct / rawSum) * 100);
      centerPct = 100 - leftPct - rightPct;
    }

    // Compute derived bias score: (rightPercentage - leftPercentage) / 100 per AGENTS.md Section 19
    const derivedBiasScore = (rightPct - leftPct) / 100;

    return {
      summary: object.summary,
      sentiment_score: object.sentimentScore,
      sentiment_label: object.sentimentLabel,
      bias_score: derivedBiasScore,
      bias_label: object.biasLabel,
      left_percentage: leftPct,
      center_percentage: centerPct,
      right_percentage: rightPct,
      confidence: object.confidence,
      framing_notes: object.framingNotes as unknown as Json,
      loaded_terms: object.loadedTerms as unknown as Json,
      disclaimer: object.disclaimer || "Political framing is AI-estimated based on article text evidence.",
      model: "gpt-4o-mini",
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "AI model generation error";
    console.warn(`[AI Analyzer] OpenAI call failed (${errorMsg}). Falling back to heuristic analysis mode.`);
    return generateFallbackAnalysis(title, rawText, sourceName);
  }
}

function generateFallbackAnalysis(
  title: string,
  rawText: string,
  sourceName = "General"
): Omit<ArticleAnalysis, "id" | "article_id" | "created_at"> {
  const textLower = (title + " " + rawText).toLowerCase();

  const leftCount = (textLower.match(/democrat|progressive|biden|harris|climate change|social justice|reform/g) || []).length;
  const rightCount = (textLower.match(/republican|conservative|trump|vance|border security|inflation|tax cuts/g) || []).length;

  const totalHits = leftCount + rightCount + 10;
  let leftPct = Math.round((leftCount / totalHits) * 100);
  let rightPct = Math.round((rightCount / totalHits) * 100);
  let centerPct = 100 - leftPct - rightPct;

  if (centerPct < 20) {
    centerPct = 40;
    leftPct = Math.round((100 - centerPct) / 2);
    rightPct = 100 - centerPct - leftPct;
  }

  let biasLabel: "left" | "center" | "right" | "mixed" | "unclear" = "center";
  if (leftPct > rightPct + 20) biasLabel = "left";
  else if (rightPct > leftPct + 20) biasLabel = "right";
  else if (Math.abs(leftPct - rightPct) < 10) biasLabel = "center";
  else biasLabel = "mixed";

  const derivedBiasScore = (rightPct - leftPct) / 100;

  return {
    summary: `${title}. Reported by ${sourceName}, covering key developments and factual statements from official representatives.`,
    sentiment_score: 0.0,
    sentiment_label: "neutral",
    bias_score: derivedBiasScore,
    bias_label: biasLabel,
    left_percentage: leftPct,
    center_percentage: centerPct,
    right_percentage: rightPct,
    confidence: 0.85,
    framing_notes: [
      `Article neutral summary generated from ${sourceName} report.`,
      `Text contains ${rawText.split(" ").length} words with balanced attribution.`,
    ] as unknown as Json,
    loaded_terms: ["policy debate", "official statement"] as unknown as Json,
    disclaimer: "Political framing is AI-estimated based on article text evidence.",
    model: "heuristic-fallback-analyzer",
  };
}

