import { getActiveSources } from "@/lib/supabase/queries/sources";
import { checkUrlsExist, insertArticles } from "@/lib/supabase/queries/articles";
import { insertLog } from "@/lib/supabase/queries/logs";
import { fetchPageHtmlWithOxylabs } from "./oxylabs";
import { extractHomepageLinks, parseArticleDetail, isCandidateArticleUrl } from "./parser";
import { Json } from "@/lib/supabase/types";

export interface ScrapePipelineOptions {
  sourceIds?: string[];
  limitPerSource?: number;
}

export interface ScrapePipelineSummary {
  status: "completed" | "failed";
  sourcesChecked: number;
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  rejectionReasons: Record<string, number>;
}

export async function runScrapePipeline(
  options: ScrapePipelineOptions = {}
): Promise<ScrapePipelineSummary> {
  const startTime = Date.now();
  const limitPerSource = options.limitPerSource || 5;
  const rejectionReasons: Record<string, number> = {};

  const recordRejection = (reason: string) => {
    rejectionReasons[reason] = (rejectionReasons[reason] || 0) + 1;
  };

  console.log("==================================================");
  console.log("🚀 [Scrape Pipeline] Starting manual scrape-to-insert run");
  console.log("==================================================");

  // Step 1: Load active sources from Supabase
  let activeSources = await getActiveSources();

  if (options.sourceIds && options.sourceIds.length > 0) {
    activeSources = activeSources.filter((s) => options.sourceIds?.includes(s.id));
  }

  if (activeSources.length === 0) {
    console.warn("⚠️ [Scrape Pipeline] No active sources found in Supabase to scrape.");
    return {
      status: "completed",
      sourcesChecked: 0,
      candidatesFound: 0,
      candidatesRejected: 0,
      duplicatesSkipped: 0,
      detailPagesScraped: 0,
      articlesInserted: 0,
      articlesRejected: 0,
      articlesFailed: 0,
      totalDurationMs: Date.now() - startTime,
      rejectionReasons,
    };
  }

  console.log(`📋 [Scrape Pipeline] Selected ${activeSources.length} active source(s): ${activeSources.map(s => s.name).join(", ")}`);

  let totalCandidatesFound = 0;
  let totalCandidatesRejected = 0;
  let totalDuplicatesSkipped = 0;
  let totalDetailScraped = 0;
  let totalArticlesInserted = 0;
  let totalArticlesRejected = 0;
  let totalArticlesFailed = 0;

  const articlesToInsert: Parameters<typeof insertArticles>[0] = [];

  // Iterate sources
  for (const source of activeSources) {
    console.log(`\n🔍 [Source] Processing ${source.name} (${source.listing_url})...`);

    // Step 2: Fetch homepage HTML live through Oxylabs
    const hpResult = await fetchPageHtmlWithOxylabs(source.listing_url);

    if (!hpResult.success || !hpResult.html) {
      console.error(`❌ [Source Error] Failed to fetch homepage for ${source.name}: ${hpResult.error}`);
      totalArticlesFailed++;
      recordRejection("Homepage fetch failed");
      continue;
    }

    console.log(`✓ [Source] Fetched homepage HTML for ${source.name} (${hpResult.html.length} chars)`);

    // Step 3: Extract candidate story card links
    const candidateLinks = extractHomepageLinks(hpResult.html, source.listing_url, source.name);
    totalCandidatesFound += candidateLinks.length;

    console.log(`📌 [Links] Extracted ${candidateLinks.length} candidate article link(s) from ${source.name}`);

    // Step 4 & 5: Filter candidate links and skip existing URLs using chunked check
    const validCandidateUrls: string[] = [];

    for (const link of candidateLinks) {
      if (!isCandidateArticleUrl(link, source.name)) {
        totalCandidatesRejected++;
        recordRejection("Failed candidate URL check");
      } else {
        validCandidateUrls.push(link);
      }
    }

    // Database Dedupe URL existence check in max 15-URL chunks per AGENTS.md Rule 9
    const existingUrlsSet = await checkUrlsExist(validCandidateUrls);

    const urlsToScrape = validCandidateUrls.filter((url) => {
      if (existingUrlsSet.has(url)) {
        totalDuplicatesSkipped++;
        recordRejection("Duplicate URL in database");
        return false;
      }
      return true;
    }).slice(0, limitPerSource);

    console.log(`🎯 [Target URLs] ${urlsToScrape.length} new article candidate(s) selected for detail scrape (Limit: ${limitPerSource})`);

    // Step 6: Scrape article detail pages through Oxylabs
    for (const detailUrl of urlsToScrape) {
      console.log(`  ➔ Scraping detail page: ${detailUrl}`);
      totalDetailScraped++;

      const detailResult = await fetchPageHtmlWithOxylabs(detailUrl);

      if (!detailResult.success || !detailResult.html) {
        totalArticlesFailed++;
        recordRejection("Detail page fetch failed");
        console.error(`  ❌ Failed detail fetch for ${detailUrl}: ${detailResult.error}`);
        continue;
      }

      // Step 7: Validate and clean detail page through content gate
      const parseResult = parseArticleDetail(detailResult.html, detailUrl, source.id);

      if (!parseResult.valid || !parseResult.article) {
        totalArticlesRejected++;
        const reason = parseResult.rejectReason || "Failed content gate";
        recordRejection(reason);
        console.log(`  ⚠️ Rejected detail page: ${reason}`);
        continue;
      }

      articlesToInsert.push(parseResult.article);
      console.log(`  ✓ Accepted article: "${parseResult.article.title.substring(0, 50)}..."`);
    }
  }

  // Step 8: Insert valid articles append-only into Supabase
  if (articlesToInsert.length > 0) {
    const inserted = await insertArticles(articlesToInsert);
    totalArticlesInserted = inserted.length;
    console.log(`\n💾 [Database] Successfully inserted ${totalArticlesInserted} new valid article(s) into Supabase.`);
  } else {
    console.log(`\nℹ️ [Database] No new valid articles were inserted during this run.`);
  }

  const durationMs = Date.now() - startTime;

  const summary: ScrapePipelineSummary = {
    status: "completed",
    sourcesChecked: activeSources.length,
    candidatesFound: totalCandidatesFound,
    candidatesRejected: totalCandidatesRejected,
    duplicatesSkipped: totalDuplicatesSkipped,
    detailPagesScraped: totalDetailScraped,
    articlesInserted: totalArticlesInserted,
    articlesRejected: totalArticlesRejected,
    articlesFailed: totalArticlesFailed,
    totalDurationMs: durationMs,
    rejectionReasons,
  };

  // Step 9: Emit run log entry to Supabase logs table
  await insertLog("info", "Oxylabs manual scrape pipeline execution completed", summary as unknown as Json);

  console.log("\n==================================================");
  console.log("🏁 [Scrape Pipeline Completed Summary]");
  console.log(JSON.stringify(summary, null, 2));
  console.log("==================================================\n");

  return summary;
}
