import { NextRequest, NextResponse } from "next/server";
import { processScheduledResults } from "@/lib/scraping/scheduler-processor";
import { runAiAnalysisPipeline } from "@/lib/ai/pipeline";
import { insertLog } from "@/lib/supabase/queries/logs";
import { Json } from "@/lib/supabase/types";

export const revalidate = 0; // Dynamic route handler

export async function GET(req: NextRequest) {
  // CRON_SECRET check per AGENTS.md Section 18
  // In production, Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && cronSecret) {
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing CRON_SECRET authorization header" },
        { status: 401 }
      );
    }
  }

  console.log("==================================================");
  console.log("⏰ 🤖 [Cron Pipeline Route] Executing Automatic Hourly Pipeline");
  console.log("==================================================");

  let scrapeSummary = null;
  let scrapeError: string | null = null;

  // Step 1: Process Scheduled Oxylabs Scrape Results
  try {
    console.log("Step 1: Processing scheduled Oxylabs results...");
    scrapeSummary = await processScheduledResults();
  } catch (err: unknown) {
    scrapeError = err instanceof Error ? err.message : "Scheduled results error";
    console.error("Step 1 Failed:", scrapeError);
  }

  let aiSummary = null;
  let aiError: string | null = null;

  // Step 2: Run AI Analysis & Vector Embedding (Must run even if Step 1 failed per Section 18)
  try {
    console.log("Step 2: Running AI Analysis & Vector Embedding on pending articles...");
    aiSummary = await runAiAnalysisPipeline();
  } catch (err: unknown) {
    aiError = err instanceof Error ? err.message : "AI pipeline error";
    console.error("Step 2 Failed:", aiError);
  }

  const pipelineResult = {
    status: scrapeError && aiError ? "failed" : "completed",
    timestamp: new Date().toISOString(),
    step1_scrape: scrapeSummary || { error: scrapeError },
    step2_ai_analysis: aiSummary || { error: aiError },
  };

  await insertLog("info", "Automatic hourly cron pipeline execution completed", pipelineResult as unknown as Json);

  return NextResponse.json(pipelineResult);
}
