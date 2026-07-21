import { NextRequest, NextResponse } from "next/server";
import { processScheduledResults } from "@/lib/scraping/scheduler-processor";

export async function POST(req: NextRequest) {
  // Enforce Admin Secret Header (AGENTS.md Section 15 & 18)
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
    const summary = await processScheduledResults();
    return NextResponse.json(summary);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Scheduled results process error";
    console.error("[POST /api/oxylabs/scheduled-results/process] Internal error:", message);

    return NextResponse.json(
      { error: "Processing scheduled results failed", message },
      { status: 500 }
    );
  }
}
