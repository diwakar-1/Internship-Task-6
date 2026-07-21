import { supabaseAdmin } from "../server";
import { Log, Json } from "../types";

export async function insertLog(
  level: "info" | "warn" | "error",
  message: string,
  details?: Json
): Promise<Log | null> {
  const { data, error } = await supabaseAdmin
    .from("logs")
    .insert({
      level,
      message,
      details: details || null,
    } as unknown as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    console.error("Error inserting system log:", error);
    return null;
  }

  return data as Log;
}

export async function getRecentLogs(limit = 50): Promise<Log[]> {
  const { data, error } = await supabaseAdmin
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching logs:", error);
    return [];
  }

  return (data as Log[]) || [];
}
