import { NextResponse } from "next/server";
import { getRecentLogs } from "@/lib/supabase/queries/logs";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET() {
  try {
    const logs = await getRecentLogs(50);
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "admin_pipeline",
      event: "logs_loaded",
      properties: { count: logs.length },
    });
    await posthog.flush();
    return NextResponse.json({ logs, count: logs.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const posthog = getPostHogClient();
    posthog.captureException(error, "admin_pipeline");
    await posthog.flush();
    return NextResponse.json(
      { error: "Failed to fetch logs", message },
      { status: 500 }
    );
  }
}
