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

export async function POST(req: Request) {
  try {
    const adminSecret = req.headers.get("x-update-me-admin-secret");
    const expectedSecret = process.env.UPDATE_ME_ADMIN_SECRET || "akskae1231ska";

    if (adminSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized admin secret" }, { status: 401 });
    }

    const body = await req.json();
    const { name, listing_url, parser_strategy, logo_url } = body;

    if (!name || !listing_url) {
      return NextResponse.json({ error: "name and listing_url are required" }, { status: 400 });
    }

    const { insertSource } = await import("@/lib/supabase/queries/sources");
    const source = await insertSource({
      name,
      listing_url,
      parser_strategy: parser_strategy || "generic",
      active: true,
      logo_url: logo_url || null,
    });

    return NextResponse.json({ success: true, source });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to insert source", message }, { status: 500 });
  }
}
