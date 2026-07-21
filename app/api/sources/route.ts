import { NextResponse } from "next/server";
import { getActiveSources } from "@/lib/supabase/queries/sources";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET() {
  try {
    const sources = await getActiveSources();
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "admin_pipeline",
      event: "sources_loaded",
      properties: { count: sources.length },
    });
    await posthog.flush();
    return NextResponse.json({ sources, count: sources.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const posthog = getPostHogClient();
    posthog.captureException(error, "admin_pipeline");
    await posthog.flush();
    return NextResponse.json(
      { error: "Failed to fetch sources", message },
      { status: 500 }
    );
  }
}
