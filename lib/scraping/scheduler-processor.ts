import { getActiveSources } from "@/lib/supabase/queries/sources";
import { getOxylabsSchedules } from "@/lib/supabase/queries/schedules";
import { fetchScheduledDoneJobs, fetchOxylabsJobContent } from "./scheduler";
import { fetchPageHtmlWithOxylabs } from "./oxylabs";
import { extractHomepageLinks, parseArticleDetail, isCandidateArticleUrl } from "./parser";
import { checkUrlsExist, insertArticles } from "@/lib/supabase/queries/articles";
import { insertLog } from "@/lib/supabase/queries/logs";
import { Json } from "@/lib/supabase/types";

export interface ScheduledProcessorSummary {
  status: "completed" | "failed";
  sourcesChecked: number;
  jobsProcessed: number;
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
}

export async function processScheduledResults(): Promise<ScheduledProcessorSummary> {
  const startTime = Date.now();
  console.log("==================================================");
  console.log("⏰ [Scheduler Processor] Starting Oxylabs Scheduled Results processing");
  console.log("==================================================");

  const activeSources = await getActiveSources();
  const dbSchedules = await getOxylabsSchedules();

  const scheduleMap = new Map<string, string>(); // source_id -> schedule_id
  for (const s of dbSchedules) {
    scheduleMap.set(s.source_id, s.schedule_id);
  }

  let totalJobsProcessed = 0;
  let totalCandidatesFound = 0;
  let totalCandidatesRejected = 0;
  let totalDuplicatesSkipped = 0;
  let totalDetailScraped = 0;
  let totalArticlesInserted = 0;
  let totalArticlesRejected = 0;
  let totalArticlesFailed = 0;

  for (const source of activeSources) {
    console.log(`\n🔍 [Scheduler Source] Checking scheduled results for "${source.name}" (${source.listing_url})...`);

    let homepageHtml: string | null = null;
    const scheduleId = scheduleMap.get(source.id);

    if (scheduleId && !scheduleId.startsWith("mock_")) {
      const doneJobs = await fetchScheduledDoneJobs(scheduleId);
      if (doneJobs.length > 0) {
        const latestJob = doneJobs[0];
        homepageHtml = await fetchOxylabsJobContent(latestJob.jobId);
        if (homepageHtml) {
          totalJobsProcessed++;
          console.log(`  ✓ Obtained scheduled HTML for "${source.name}" from job ${latestJob.jobId}`);
        }
      }
    }

    // Fallback: If no scheduled job HTML present yet, fetch live homepage html (Section 18 fallback)
    if (!homepageHtml) {
      console.log(`  ℹ️ No completed scheduled run found for "${source.name}". Fetching homepage live via Oxylabs...`);
      const liveResult = await fetchPageHtmlWithOxylabs(source.listing_url);
      if (liveResult.success && liveResult.html) {
        homepageHtml = liveResult.html;
      }
    }

    if (!homepageHtml) {
      console.warn(`  ⚠️ Could not obtain homepage HTML for "${source.name}". Skipping source.`);
      totalArticlesFailed++;
      continue;
    }

    // 1. Extract candidate links from homepage HTML (Section 9 & 11)
    const rawCandidates = extractHomepageLinks(homepageHtml, source.listing_url, source.name);
    console.log(`  ➔ Extracted ${rawCandidates.length} candidate story link(s)`);

    // 2. Reject URLs on non-article reject list & candidate filtering
    const validCandidates: string[] = [];
    for (const link of rawCandidates) {
      if (!isCandidateArticleUrl(link, source.name)) {
        totalCandidatesRejected++;
      } else {
        validCandidates.push(link);
      }
    }

    totalCandidatesFound += validCandidates.length;

    // 3. Dedupe candidate URLs against Supabase using URL existence check in <= 15 chunks (Section 9)
    const existingSet = await checkUrlsExist(validCandidates);
    const newCandidates = validCandidates.filter((url) => !existingSet.has(url));
    const duplicatesCount = validCandidates.length - newCandidates.length;
    totalDuplicatesSkipped += duplicatesCount;

    console.log(`  ➔ Candidates: ${validCandidates.length}, Duplicates Skipped: ${duplicatesCount}, New to Scrape: ${newCandidates.length}`);

    // Limit to top 5 valid story cards per source
    const candidatesToScrape = newCandidates.slice(0, 5);

    // 4. Scrape detail pages, validate, and insert articles
    const validArticlesToInsert: Array<{
      source_id: string;
      original_url: string;
      canonical_url: string | null;
      title: string;
      image_url: string;
      published_date: string;
      raw_text: string;
    }> = [];

    for (const detailUrl of candidatesToScrape) {
      console.log(`    ➔ Scraping detail page: ${detailUrl}`);
      const detailResult = await fetchPageHtmlWithOxylabs(detailUrl);
      totalDetailScraped++;

      if (!detailResult.success || !detailResult.html) {
        totalArticlesFailed++;
        continue;
      }

      // Validate & clean detail page content (Article Content Gate per Section 13)
      const parseResult = parseArticleDetail(detailResult.html, detailUrl, source.id);
      if (parseResult.valid && parseResult.article) {
        validArticlesToInsert.push({
          source_id: source.id,
          original_url: parseResult.article.original_url,
          canonical_url: parseResult.article.canonical_url,
          title: parseResult.article.title,
          image_url: parseResult.article.image_url,
          published_date: parseResult.article.published_date,
          raw_text: parseResult.article.raw_text,
        });
      } else {
        totalArticlesRejected++;
        console.warn(`    ⚠️ Article content gate rejected page: ${detailUrl}`);
      }
    }

    // 5. Insert valid articles append-only into Supabase (Section 10)
    if (validArticlesToInsert.length > 0) {
      const inserted = await insertArticles(validArticlesToInsert);
      totalArticlesInserted += inserted.length;
      console.log(`  ✓ Inserted ${inserted.length} valid article(s) into Supabase for "${source.name}"`);
    }
  }

  const durationMs = Date.now() - startTime;
  const summary: ScheduledProcessorSummary = {
    status: "completed",
    sourcesChecked: activeSources.length,
    jobsProcessed: totalJobsProcessed,
    candidatesFound: totalCandidatesFound,
    candidatesRejected: totalCandidatesRejected,
    duplicatesSkipped: totalDuplicatesSkipped,
    detailPagesScraped: totalDetailScraped,
    articlesInserted: totalArticlesInserted,
    articlesRejected: totalArticlesRejected,
    articlesFailed: totalArticlesFailed,
    totalDurationMs: durationMs,
  };

  await insertLog("info", "Scheduled Oxylabs results pipeline execution completed", summary as unknown as Json);

  console.log("\n==================================================");
  console.log("🏁 [Scheduler Processor Completed Summary]");
  console.log(JSON.stringify(summary, null, 2));
  console.log("==================================================\n");

  return summary;
}
