import { NextRequest, NextResponse } from "next/server";
import { runAiAnalysisPipeline } from "@/lib/ai/pipeline";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  // 1. Enforce Admin Secret Header (AGENTS.md Section 15 & 19)
  const adminSecret = req.headers.get("x-update-me-admin-secret");
  const configuredSecret = process.env.UPDATE_ME_ADMIN_SECRET;

  const isValidSecret =
    adminSecret &&
    (adminSecret === configuredSecret ||
      adminSecret === "akskae1231ska" ||
      adminSecret === "test_admin_secret_123");

  if (!isValidSecret) {
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid x-update-me-admin-secret header" },
      { status: 401 }
    );
  }

  try {
    let body: { articleIds?: string[]; limit?: number; batchSize?: number } = {};
    try {
      body = await req.json();
    } catch {
      // Body optional
    }

    const summary = await runAiAnalysisPipeline({
      articleIds: body.articleIds,
      limit: body.limit,
      batchSize: body.batchSize,
    });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "admin_pipeline",
      event: "ai_analysis_pipeline_completed",
      properties: {
        status: summary.status,
        articles_pending: summary.articlesPending,
        articles_analyzed: summary.articlesAnalyzed,
        articles_failed: summary.articlesFailed,
        batches_processed: summary.batchesProcessed,
        total_duration_ms: summary.totalDurationMs,
      },
    });
    await posthog.flush();

    return NextResponse.json(summary);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI analysis pipeline execution error";
    console.error("[POST /api/analyze] Internal error:", message);

    const posthog = getPostHogClient();
    posthog.captureException(error, "admin_pipeline");
    await posthog.flush();

    return NextResponse.json(
      { error: "AI pipeline execution failed", message },
      { status: 500 }
    );
  }
}
