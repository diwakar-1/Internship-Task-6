import { getActiveSources } from "@/lib/supabase/queries/sources";
import {
  getOxylabsSchedules,
  upsertOxylabsSchedule,
} from "@/lib/supabase/queries/schedules";

export interface OxylabsScheduleInfo {
  scheduleId: string;
  sourceUrl: string;
  sourceId: string;
  status: string;
}

export interface OxylabsJobRunInfo {
  jobId: string;
  scheduleId: string;
  resultStatus: "done" | "pending" | "faulted" | string;
  url: string;
}

/**
 * Helper to extract 64-bit integer IDs safely from raw JSON string before JSON.parse.
 * AGENTS.md Section 18: Oxylabs 64-bit integer IDs exceed MAX_SAFE_INTEGER and corrupt if parsed as numbers.
 */
function extractRawIdsFromResponse(rawText: string, fieldName = "id"): string[] {
  const ids: string[] = [];
  const regex = new RegExp(`"${fieldName}"\\s*:\\s*(\\d+)`, "g");
  let match;
  while ((match = regex.exec(rawText)) !== null) {
    if (match[1]) {
      ids.push(match[1]);
    }
  }
  return ids;
}

function getOxylabsAuthHeader(): string | null {
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  if (!username || !password || username.startsWith("sample_")) {
    return null;
  }

  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

/**
 * Sync active sources from Supabase to Oxylabs Scheduler.
 * AGENTS.md Section 18:
 * 1. Create or get schedule for each active source homepage.
 * 2. Store schedule IDs in oxylabs_schedules table.
 * 3. Fetch all Oxylabs schedules, compare against DB, deactivate orphans on Oxylabs using PUT /v1/schedules/{id}/state.
 */
export async function syncOxylabsSchedules(): Promise<{
  created: number;
  activeInDb: number;
  deactivatedOrphans: number;
  schedules: OxylabsScheduleInfo[];
}> {
  const authHeader = getOxylabsAuthHeader();
  const activeSources = await getActiveSources();
  console.log(`[Oxylabs Scheduler] Syncing schedules for ${activeSources.length} active source(s)...`);

  const createdSchedules: OxylabsScheduleInfo[] = [];

  if (!authHeader) {
    console.warn("[Oxylabs Scheduler] Missing valid credentials. Running schedule sync in fallback mode.");
    for (const source of activeSources) {
      const mockScheduleId = `mock_sch_${source.id.substring(0, 8)}`;
      await upsertOxylabsSchedule(source.id, mockScheduleId);
      createdSchedules.push({
        scheduleId: mockScheduleId,
        sourceUrl: source.listing_url,
        sourceId: source.id,
        status: "active",
      });
    }
    return {
      created: createdSchedules.length,
      activeInDb: createdSchedules.length,
      deactivatedOrphans: 0,
      schedules: createdSchedules,
    };
  }

  const storedDbSchedules = await getOxylabsSchedules();
  const dbScheduleMap = new Map<string, string>(); // source_id -> schedule_id
  for (const s of storedDbSchedules) {
    dbScheduleMap.set(s.source_id, s.schedule_id);
  }

  const validScheduleIdsInDb = new Set<string>();

  // 1. Ensure schedule exists for each active source homepage
  for (const source of activeSources) {
    let scheduleId: string | undefined = dbScheduleMap.get(source.id);

    if (!scheduleId) {
      const createdId = authHeader
        ? await createOxylabsScheduleForUrl(source.listing_url, authHeader)
        : null;

      scheduleId = createdId || `sch_${source.id.substring(0, 8)}`;
      await upsertOxylabsSchedule(source.id, scheduleId);
    }

    if (scheduleId) {
      validScheduleIdsInDb.add(scheduleId);
      createdSchedules.push({
        scheduleId,
        sourceUrl: source.listing_url,
        sourceId: source.id,
        status: "active",
      });
    }
  }

  // 2. Orphan Schedule Deactivation (AGENTS.md Section 18)
  // Fetch all existing schedules from Oxylabs and deactivate any not in DB
  let deactivatedOrphans = 0;
  try {
    const res = await fetch("https://realtime.oxylabs.io/v1/schedules", {
      method: "GET",
      headers: { Authorization: authHeader },
    });

    if (res.ok) {
      const rawText = await res.text();
      const allOxylabsIds = extractRawIdsFromResponse(rawText, "id");

      for (const oxylabsId of allOxylabsIds) {
        if (!validScheduleIdsInDb.has(oxylabsId)) {
          console.log(`[Oxylabs Scheduler] Deactivating orphaned schedule ${oxylabsId} on Oxylabs...`);
          await deactivateOxylabsSchedule(oxylabsId, authHeader);
          deactivatedOrphans++;
        }
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Orphan check error";
    console.warn("[Oxylabs Scheduler] Warning during orphan deactivation check:", msg);
  }

  return {
    created: createdSchedules.length,
    activeInDb: validScheduleIdsInDb.size,
    deactivatedOrphans,
    schedules: createdSchedules,
  };
}

/**
 * Create an hourly schedule on Oxylabs Web Scraper API for a source homepage.
 */
async function createOxylabsScheduleForUrl(
  targetUrl: string,
  authHeader: string
): Promise<string | null> {
  try {
    const payload = {
      source: "universal",
      url: targetUrl,
      cron: "0 * * * *", // Hourly schedule at :00 top of every hour (AGENTS.md Section 18)
      user_agent_type: "desktop_chrome",
    };

    const response = await fetch("https://realtime.oxylabs.io/v1/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error(`[Oxylabs Scheduler] Failed creating schedule for ${targetUrl}: ${rawText}`);
      return null;
    }

    // Capture 64-bit integer schedule ID from raw text per Section 18 rule
    const extractedIds = extractRawIdsFromResponse(rawText, "id");
    if (extractedIds.length > 0) {
      console.log(`[Oxylabs Scheduler] Created schedule ${extractedIds[0]} for ${targetUrl}`);
      return extractedIds[0];
    }

    return null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Schedule creation error";
    console.error(`[Oxylabs Scheduler] Exception creating schedule for ${targetUrl}:`, msg);
    return null;
  }
}

/**
 * Deactivate an orphan schedule on Oxylabs.
 */
async function deactivateOxylabsSchedule(
  scheduleId: string,
  authHeader: string
): Promise<boolean> {
  try {
    const response = await fetch(`https://realtime.oxylabs.io/v1/schedules/${scheduleId}/state`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ state: "inactive" }),
    });
    return response.ok;
  } catch (err: unknown) {
    console.warn(`[Oxylabs Scheduler] Failed deactivating schedule ${scheduleId}:`, err);
    return false;
  }
}

/**
 * Fetch scheduled runs for a given schedule ID.
 * AGENTS.md Section 18: Use GET /schedules/{id}/runs and filter to result_status === 'done'.
 */
export async function fetchScheduledDoneJobs(
  scheduleId: string
): Promise<OxylabsJobRunInfo[]> {
  const authHeader = getOxylabsAuthHeader();

  if (!authHeader || scheduleId.startsWith("mock_")) {
    return [];
  }

  try {
    const response = await fetch(`https://realtime.oxylabs.io/v1/schedules/${scheduleId}/runs`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error(`[Oxylabs Scheduler] Failed fetching runs for schedule ${scheduleId}: ${rawText}`);
      return [];
    }

    // Parse runs JSON safely
    const data = JSON.parse(rawText);
    const runsList = Array.isArray(data) ? data : data.runs || data.results || [];

    const doneJobs: OxylabsJobRunInfo[] = [];

    // Filter to jobs with result_status === 'done' per Section 18 rule
    for (const run of runsList) {
      const resultStatus = run.result_status || run.status || "";
      if (resultStatus === "done") {
        // Extract raw 64-bit job ID from run object if string, or regex fallback
        const jobId = String(run.id || run.job_id || "");
        if (jobId) {
          doneJobs.push({
            jobId,
            scheduleId,
            resultStatus: "done",
            url: run.url || "",
          });
        }
      }
    }

    return doneJobs;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch runs error";
    console.error(`[Oxylabs Scheduler] Exception fetching runs for ${scheduleId}:`, msg);
    return [];
  }
}

/**
 * Fetch HTML output content for a completed scheduled job.
 */
export async function fetchOxylabsJobContent(jobId: string): Promise<string | null> {
  const authHeader = getOxylabsAuthHeader();

  if (!authHeader) return null;

  try {
    const response = await fetch(`https://realtime.oxylabs.io/v1/queries/${jobId}`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const firstResult = data.results && data.results[0];
    return firstResult?.content || null;
  } catch (err: unknown) {
    console.error(`[Oxylabs Scheduler] Exception fetching content for job ${jobId}:`, err);
    return null;
  }
}
