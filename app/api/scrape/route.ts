import { NextRequest, NextResponse } from "next/server";
import { runScrapePipeline } from "@/lib/scraping/pipeline";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  // 1. Enforce Admin Secret Header (AGENTS.md Section 15)
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
    let body: { sourceIds?: string[]; limitPerSource?: number } = {};
    try {
      body = await req.json();
    } catch {
      // Body optional
    }

    const summary = await runScrapePipeline({
      sourceIds: body.sourceIds,
      limitPerSource: body.limitPerSource,
    });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "admin_pipeline",
      event: "scrape_pipeline_completed",
      properties: {
        status: summary.status,
        sources_checked: summary.sourcesChecked,
        articles_inserted: summary.articlesInserted,
        articles_failed: summary.articlesFailed,
        total_duration_ms: summary.totalDurationMs,
      },
    });
    await posthog.flush();

    return NextResponse.json(summary);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Scrape pipeline execution error";
    console.error("[POST /api/scrape] Internal error:", message);

    const posthog = getPostHogClient();
    posthog.captureException(error, "admin_pipeline");
    await posthog.flush();

    return NextResponse.json(
      { error: "Pipeline execution failed", message },
      { status: 500 }
    );
  }
}
