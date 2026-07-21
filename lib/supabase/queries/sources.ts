import { supabaseAdmin } from "../server";
import { Source } from "../types";

export async function getActiveSources(): Promise<Source[]> {
  const { data, error } = await supabaseAdmin
    .from("sources")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching active sources:", error);
    return [];
  }

  return (data as Source[]) || [];
}

export async function getAllSources(): Promise<Source[]> {
  const { data, error } = await supabaseAdmin
    .from("sources")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching all sources:", error);
    return [];
  }

  return (data as Source[]) || [];
}

export async function insertSource(
  source: Omit<Source, "id" | "created_at">
): Promise<Source | null> {
  const { data, error } = await supabaseAdmin
    .from("sources")
    .insert(source as unknown as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    console.error("Error inserting source:", error);
    return null;
  }

  return data as Source;
}

export async function toggleSourceActive(id: string, active: boolean): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("sources")
    .update({ active } as unknown as Record<string, unknown>)
    .eq("id", id);

  if (error) {
    console.error("Error toggling source active state:", error);
    return false;
  }

  return true;
}
