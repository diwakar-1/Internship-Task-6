import * as cheerio from "cheerio";

export interface ParsedArticleData {
  source_id: string;
  original_url: string;
  canonical_url: string | null;
  title: string;
  image_url: string;
  published_date: string;
  raw_text: string;
}

export interface ParseDetailResult {
  valid: boolean;
  article?: ParsedArticleData;
  rejectReason?: string;
}

// Canonical Non-Article Reject List (AGENTS.md Section 9)
const REJECT_URL_PATTERNS = [
  /\/category\//i,
  /\/sections?\//i,
  /\/topics?\//i,
  /\/tags?\//i,
  /\/authors?\//i,
  /\/search\b/i,
  /\/shows?\//i,
  /\/programs?\//i,
  /\/podcasts?\//i,
  /\/live\b/i,
  /\/games?\//i,
  /\/products?\//i,
  /\/reviews?\//i,
  /\/shopping\//i,
  /\/about\b/i,
  /\/contact\b/i,
  /\/terms\b/i,
  /\/privacy\b/i,
  /\/help\b/i,
  /\/newsletters?\//i,
  /\/subscribe\b/i,
  /\/video\//i,
  /\/audio\//i,
];

// Source-specific category & non-article patterns (AGENTS.md Section 11)
const SOURCE_REJECT_PATTERNS: Record<string, RegExp[]> = {
  Reuters: [/\/world\/[a-z-]+$/i, /\/business\/[a-z-]+$/i, /\/technology\/[a-z-]+$/i, /\/markets\/?$/i],
  "BBC News": [/\/sport\b/i, /\/weather\b/i, /\/iplayer\b/i, /\/sounds\b/i, /\/live\//i],
  "NPR News": [/\/sections\//i, /\/series\//i, /\/programs\//i, /\/music\//i],
  "Fox News": [/\/shows\//i, /\/games\//i, /\/voter-analysis\//i, /\/person\//i],
  "The Guardian": [/\/thefilter-us\/?$/i, /\/us\/[a-z-]+\/?$/i, /\/profile\//i],
};

/**
 * Check if a candidate URL passes the non-article reject list and source rules.
 */
export function isCandidateArticleUrl(urlStr: string, sourceName = ""): boolean {
  try {
    const parsed = new URL(urlStr);
    const pathname = parsed.pathname.toLowerCase();

    // 1. Must be http/https
    if (!parsed.protocol.startsWith("http")) return false;

    // 2. Reject homepage root paths
    if (pathname === "/" || pathname === "" || pathname === "/index.html") return false;

    // 3. Reject canonical non-article reject list patterns
    for (const pattern of REJECT_URL_PATTERNS) {
      if (pattern.test(pathname)) return false;
    }

    // 4. Source-specific parser check
    if (sourceName && SOURCE_REJECT_PATTERNS[sourceName]) {
      for (const pattern of SOURCE_REJECT_PATTERNS[sourceName]) {
        if (pattern.test(pathname)) return false;
      }
    }

    // 5. Must look like an article detail URL (slug with dashes, date in path, or unique ID/hash)
    const hasSlugDashes = (pathname.match(/-/g) || []).length >= 2;
    const hasDatePattern = /\/\d{4}\/\d{2}\//.test(pathname) || /-\d{8}\b/.test(pathname) || /-\d{6,}\b/.test(pathname);
    const hasArticleId = /\/[a-z0-9]{8,}/.test(pathname) || pathname.endsWith(".html");

    return hasSlugDashes || hasDatePattern || hasArticleId;
  } catch {
    return false;
  }
}

/**
 * Extract visible story card links from a homepage HTML string.
 */
export function extractHomepageLinks(html: string, listingUrl: string, sourceName = ""): string[] {
  const $ = cheerio.load(html);
  const linksSet = new Set<string>();

  // Find candidate anchors in story/article card blocks
  $("article a, [class*='story'] a, [class*='card'] a, [class*='item'] a, h2 a, h3 a, h4 a, main a").each((_, elem) => {
    const href = $(elem).attr("href");
    if (!href) return;

    try {
      const absoluteUrl = new URL(href, listingUrl).toString();
      // Remove query string and hash for clean deduplication
      const cleanUrl = absoluteUrl.split("?")[0].split("#")[0];

      if (isCandidateArticleUrl(cleanUrl, sourceName)) {
        linksSet.add(cleanUrl);
      }
    } catch {
      // Ignore invalid URLs
    }
  });

  return Array.from(linksSet);
}

/**
 * Validate and clean an article detail HTML page.
 * Strictly enforces AGENTS.md Section 13 Content Gate criteria.
 */
export function parseArticleDetail(
  html: string,
  articleUrl: string,
  sourceId: string
): ParseDetailResult {
  const $ = cheerio.load(html);

  // 1. Remove unwanted elements before extracting text (AGENTS.md Section 13)
  $(
    "script, style, iframe, nav, footer, header, noscript, svg, form, [class*='ad-'], [class*='newsletter'], [class*='subscription'], [class*='related'], [class*='most-read'], [class*='share'], [id*='ad-']"
  ).remove();

  // 2. Extract Title
  let title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().trim();

  // Clean title suffix like " | Reuters" or " - BBC News"
  if (title) {
    title = title.split(" | ")[0].split(" - ")[0].split(" — ")[0].trim();
  }

  if (!title || title.length < 10) {
    return { valid: false, rejectReason: "Missing or generic title" };
  }

  // Reject generic page titles
  if (
    /home|index|category|section|news|breaking|opinion|video|live/i.test(title) &&
    title.length < 20
  ) {
    return { valid: false, rejectReason: "Title is generic section name" };
  }

  // 3. Extract Image URL (REQUIRED by AGENTS.md Section 13)
  const imageUrl =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    $("article img, main img, figure img").first().attr("src");

  if (!imageUrl || !imageUrl.startsWith("http")) {
    return { valid: false, rejectReason: "Missing required image URL" };
  }

  // 4. Extract Published Date (REQUIRED by AGENTS.md Section 13)
  const publishedDateStr =
    $('meta[property="article:published_time"]').attr("content") ||
    $('meta[name="parsely-pub-date"]').attr("content") ||
    $('meta[name="publish-date"]').attr("content") ||
    $("time[datetime]").first().attr("datetime") ||
    $("time").first().text().trim();

  if (!publishedDateStr) {
    return { valid: false, rejectReason: "Missing required published date" };
  }

  let publishedDateIso: string;
  try {
    const d = new Date(publishedDateStr);
    if (isNaN(d.getTime())) {
      return { valid: false, rejectReason: "Invalid published date string" };
    }
    publishedDateIso = d.toISOString();
  } catch {
    return { valid: false, rejectReason: "Failed to parse published date" };
  }

  // 5. Extract Canonical URL
  const canonicalUrl = $('link[rel="canonical"]').attr("href") || articleUrl;

  // 6. Extract Body Paragraphs & Clean Text
  const paragraphTexts: string[] = [];

  $("article p, main p, [class*='article-body'] p, [class*='story-body'] p").each((_, elem) => {
    const text = $(elem).text().trim();
    // Exclude short caption/disclaimer snippets
    if (text.length > 35 && !/click here|subscribe|copyright|all rights reserved/i.test(text)) {
      paragraphTexts.push(text);
    }
  });

  const rawText = paragraphTexts.join("\n\n").trim();
  const totalChars = rawText.length;

  // Body quality gate (AGENTS.md Section 13): Either 3+ paragraphs or 900+ chars
  const passesBodyQuality = paragraphTexts.length >= 3 || totalChars >= 900;

  if (!passesBodyQuality) {
    return {
      valid: false,
      rejectReason: `Insufficient body content (${paragraphTexts.length} paragraphs, ${totalChars} chars)`,
    };
  }

  return {
    valid: true,
    article: {
      source_id: sourceId,
      original_url: articleUrl,
      canonical_url: canonicalUrl,
      title,
      image_url: imageUrl,
      published_date: publishedDateIso,
      raw_text: rawText,
    },
  };
}
