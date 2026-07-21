import { supabaseAdmin } from "../server";
import { OxylabsSchedule, OxylabsScheduleRun } from "../types";

export async function getOxylabsSchedules(): Promise<OxylabsSchedule[]> {
  const { data, error } = await supabaseAdmin
    .from("oxylabs_schedules")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching Oxylabs schedules:", error);
    return [];
  }

  return (data as OxylabsSchedule[]) || [];
}

export async function upsertOxylabsSchedule(
  sourceId: string,
  scheduleId: string
): Promise<OxylabsSchedule | null> {
  const { data, error } = await supabaseAdmin
    .from("oxylabs_schedules")
    .upsert(
      {
        source_id: sourceId,
        schedule_id: scheduleId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "schedule_id" }
    )
    .select()
    .single();

  if (error) {
    console.error(`Error upserting Oxylabs schedule for source ${sourceId}:`, error);
    return null;
  }

  return data as OxylabsSchedule;
}

export async function deleteOxylabsSchedule(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("oxylabs_schedules")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting Oxylabs schedule ${id}:`, error);
    return false;
  }

  return true;
}

export async function getOxylabsScheduleRuns(limit = 50): Promise<OxylabsScheduleRun[]> {
  const { data, error } = await supabaseAdmin
    .from("oxylabs_schedule_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching Oxylabs schedule runs:", error);
    return [];
  }

  return (data as OxylabsScheduleRun[]) || [];
}

export async function logScheduleRun(
  scheduleId: string,
  runId: string,
  status: string,
  completedAt?: string
): Promise<OxylabsScheduleRun | null> {
  const { data, error } = await supabaseAdmin
    .from("oxylabs_schedule_runs")
    .insert({
      schedule_id: scheduleId,
      run_id: runId,
      status,
      completed_at: completedAt || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting schedule run:", error);
    return null;
  }

  return data as OxylabsScheduleRun;
}
