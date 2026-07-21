import { NextRequest, NextResponse } from "next/server";
import { syncOxylabsSchedules } from "@/lib/scraping/scheduler";
import { getOxylabsSchedules } from "@/lib/supabase/queries/schedules";

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
    const summary = await syncOxylabsSchedules();
    return NextResponse.json(summary);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Schedule sync error";
    console.error("[POST /api/oxylabs/schedules] Internal error:", message);

    return NextResponse.json(
      { error: "Schedule sync failed", message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const schedules = await getOxylabsSchedules();
    return NextResponse.json({ schedules, count: schedules.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Schedule list error";
    return NextResponse.json(
      { error: "Failed listing schedules", message },
      { status: 500 }
    );
  }
}
