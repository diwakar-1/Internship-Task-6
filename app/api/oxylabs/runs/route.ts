import { NextResponse } from "next/server";
import { getOxylabsScheduleRuns } from "@/lib/supabase/queries/schedules";

export async function GET() {
  try {
    const runs = await getOxylabsScheduleRuns();
    return NextResponse.json({ runs, count: runs.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Schedule runs error";
    return NextResponse.json(
      { error: "Failed listing schedule runs", message },
      { status: 500 }
    );
  }
}
