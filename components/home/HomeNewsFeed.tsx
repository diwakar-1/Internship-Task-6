"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HomeNavbar } from "./HomeNavbar";
import { HomeNewsCard } from "./HomeNewsCard";
import { HomeFooter } from "./HomeFooter";
import { Article } from "@/lib/supabase/types";
import { getDistinctArticleImage } from "@/lib/utils/image";
import { RefreshCw, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface HomeNewsFeedProps {
  initialArticles: Article[];
}

export const HomeNewsFeed: React.FC<HomeNewsFeedProps> = ({ initialArticles }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_news_location") || "United States";
    }
    return "United States";
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userTopics, setUserTopics] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const storedTopics = localStorage.getItem("user_news_topics");
      if (storedTopics) {
        try {
          return JSON.parse(storedTopics);
        } catch {
          // ignore parse error
        }
      }
    }
    return ["Technology", "Politics"];
  });
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeMessage, setScrapeMessage] = useState<string | null>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const handleRunScrape = async () => {
    setIsScraping(true);
    setScrapeMessage("Scraping fresh news from active sources via Oxylabs...");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "x-update-me-admin-secret": "akskae1231ska",
        },
      });
      const data = await res.json();
      if (data.articlesInserted !== undefined) {
        setScrapeMessage(`Scraped ${data.articlesInserted} new articles successfully! Refreshing...`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setScrapeMessage("Scrape trigger sent successfully. Refreshing page...");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch {
      setScrapeMessage("Scrape process completed. Reloading page...");
      setTimeout(() => window.location.reload(), 1500);
    } finally {
      setIsScraping(false);
    }
  };

  // Filter articles based on activeTab, selectedLocation, and activeCategory
  const filteredArticles = initialArticles.filter((article) => {
    const sourceName = (article.source?.name || "").toLowerCase().trim();
    const titleLower = (article.title || "").toLowerCase().trim();
    const locLower = (selectedLocation || "").toLowerCase().trim();
    const rawTextLower = (article.raw_text || "").toLowerCase().trim();

    // Search Query Filtering
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = titleLower.includes(q) || sourceName.includes(q) || rawTextLower.includes(q);
      if (!matchesSearch) return false;
    }

    // 1. Tab / Region Filtering
    if (activeTab === "Local") {
      const isMatchLoc =
        locLower.includes("india") || locLower.includes("in")
          ? sourceName.includes("reuters") ||
            sourceName.includes("bbc") ||
            sourceName.includes("espn") ||
            sourceName.includes("ndtv") ||
            sourceName.includes("times") ||
            sourceName.includes("india") ||
            titleLower.includes("india") ||
            titleLower.includes("delhi") ||
            titleLower.includes("mumbai") ||
            titleLower.includes("modi") ||
            titleLower.includes("bcci") ||
            titleLower.includes("ipl") ||
            rawTextLower.includes("india") ||
            rawTextLower.includes("new delhi")
          : locLower.includes("united states") || locLower.includes("us")
          ? sourceName.includes("fox") ||
            sourceName.includes("npr") ||
            sourceName.includes("reuters") ||
            sourceName.includes("guardian") ||
            sourceName.includes("accuweather") ||
            sourceName.includes("espn") ||
            sourceName.includes("techcrunch") ||
            sourceName.includes("fortune") ||
            titleLower.includes("us") ||
            titleLower.includes("america") ||
            titleLower.includes("united states") ||
            titleLower.includes("biden") ||
            titleLower.includes("trump") ||
            rawTextLower.includes("united states") ||
            rawTextLower.includes("washington")
          : locLower.includes("australia") || locLower.includes("au")
          ? sourceName.includes("reuters") ||
            sourceName.includes("bbc") ||
            sourceName.includes("guardian") ||
            sourceName.includes("abc") ||
            sourceName.includes("sydney") ||
            sourceName.includes("australia") ||
            titleLower.includes("australia") ||
            titleLower.includes("sydney") ||
            titleLower.includes("melbourne") ||
            titleLower.includes("canberra") ||
            rawTextLower.includes("australia")
          : titleLower.includes(locLower) || sourceName.includes(locLower) || rawTextLower.includes(locLower);

      if (!isMatchLoc) {
        return false;
      }
    } else if (activeTab === "For You") {
      if (userTopics.length > 0) {
        const matchesTopic = userTopics.some((topic) => {
          const t = topic.toLowerCase().trim();
          if (t.includes("weather")) return titleLower.includes("weather") || titleLower.includes("storm") || titleLower.includes("forecast") || titleLower.includes("climate") || sourceName.includes("accuweather");
          if (t.includes("sport") || t.includes("ipl") || t.includes("cup")) return titleLower.includes("sport") || titleLower.includes("match") || titleLower.includes("game") || titleLower.includes("cricket") || sourceName.includes("espn");
          if (t.includes("tech")) return titleLower.includes("tech") || titleLower.includes("ai") || titleLower.includes("software") || sourceName.includes("techcrunch");
          if (t.includes("business")) return titleLower.includes("market") || titleLower.includes("bank") || titleLower.includes("trade") || titleLower.includes("economy") || sourceName.includes("fortune");
          return titleLower.includes(t) || sourceName.includes(t) || rawTextLower.includes(t);
        });
        if (!matchesTopic) return false;
      }
    } else if (activeTab === "World") {
      const isWorld =
        titleLower.includes("world") ||
        titleLower.includes("global") ||
        titleLower.includes("ukraine") ||
        titleLower.includes("russia") ||
        titleLower.includes("china") ||
        titleLower.includes("war") ||
        titleLower.includes("minister") ||
        titleLower.includes("president") ||
        sourceName.includes("bbc") ||
        sourceName.includes("reuters") ||
        sourceName.includes("guardian") ||
        rawTextLower.includes("world");
      if (!isWorld) return false;
    } else if (activeTab === "Business") {
      const isBiz =
        titleLower.includes("market") ||
        titleLower.includes("bank") ||
        titleLower.includes("trade") ||
        titleLower.includes("economy") ||
        titleLower.includes("finance") ||
        titleLower.includes("stock") ||
        titleLower.includes("business") ||
        sourceName.includes("fortune") ||
        sourceName.includes("cnbc") ||
        rawTextLower.includes("business");
      if (!isBiz) return false;
    } else if (activeTab === "Tech") {
      const isTech =
        titleLower.includes("tech") ||
        titleLower.includes("ai") ||
        titleLower.includes("data") ||
        titleLower.includes("software") ||
        titleLower.includes("artificial intelligence") ||
        titleLower.includes("app") ||
        titleLower.includes("smartwatch") ||
        sourceName.includes("techcrunch") ||
        rawTextLower.includes("technology");
      if (!isTech) return false;
    } else if (activeTab === "Travel") {
      const isTravel =
        titleLower.includes("travel") ||
        titleLower.includes("tourist") ||
        titleLower.includes("flight") ||
        titleLower.includes("destination") ||
        titleLower.includes("hotel") ||
        titleLower.includes("museum") ||
        rawTextLower.includes("travel") ||
        rawTextLower.includes("tourist");
      if (!isTravel) return false;
    } else if (activeTab === "Blindspot") {
      const left = Number(article.analysis?.left_percentage || 0);
      const right = Number(article.analysis?.right_percentage || 0);
      const diff = Math.abs(left - right);
      if (diff < 15) return false;
    }

    // 2. Category Chips Bar Filtering
    if (activeCategory) {
      const catLower = activeCategory.toLowerCase().trim();
      let matchesCat = false;

      if (catLower.includes("weather")) {
        matchesCat =
          titleLower.includes("weather") ||
          titleLower.includes("storm") ||
          titleLower.includes("rain") ||
          titleLower.includes("forecast") ||
          titleLower.includes("climate") ||
          sourceName.includes("accuweather") ||
          rawTextLower.includes("weather") ||
          rawTextLower.includes("climate");
      } else if (catLower.includes("sport") || catLower.includes("cup") || catLower.includes("ipl") || catLower.includes("soccer")) {
        matchesCat =
          titleLower.includes("sport") ||
          titleLower.includes("match") ||
          titleLower.includes("game") ||
          titleLower.includes("team") ||
          titleLower.includes("ipl") ||
          titleLower.includes("cup") ||
          sourceName.includes("espn") ||
          rawTextLower.includes("sport");
      } else if (catLower.includes("technology") || catLower.includes("tech") || catLower.includes("ai")) {
        matchesCat =
          titleLower.includes("tech") ||
          titleLower.includes("ai") ||
          titleLower.includes("data") ||
          titleLower.includes("software") ||
          titleLower.includes("artificial intelligence") ||
          sourceName.includes("techcrunch") ||
          rawTextLower.includes("technology") ||
          rawTextLower.includes("artificial intelligence");
      } else if (catLower.includes("business") || catLower.includes("market")) {
        matchesCat =
          titleLower.includes("market") ||
          titleLower.includes("bank") ||
          titleLower.includes("trade") ||
          titleLower.includes("economy") ||
          titleLower.includes("finance") ||
          sourceName.includes("fortune") ||
          rawTextLower.includes("business") ||
          rawTextLower.includes("markets");
      } else if (catLower.includes("politic")) {
        matchesCat =
          titleLower.includes("politic") ||
          titleLower.includes("election") ||
          titleLower.includes("government") ||
          titleLower.includes("senate") ||
          titleLower.includes("president") ||
          rawTextLower.includes("politics");
      } else if (catLower.includes("health") || catLower.includes("medicine")) {
        matchesCat =
          titleLower.includes("health") ||
          titleLower.includes("medicine") ||
          titleLower.includes("doctor") ||
          titleLower.includes("virus") ||
          titleLower.includes("fda") ||
          rawTextLower.includes("health");
      } else {
        matchesCat =
          titleLower.includes(catLower) ||
          sourceName.includes(catLower) ||
          rawTextLower.includes(catLower);
      }

      if (!matchesCat) return false;
    }

    return true;
  });

  const leadArticle = filteredArticles[0];
  const centerArticles = filteredArticles.slice(1, 5);
  const showcaseArticles = filteredArticles.slice(0, 5);
  const gridArticles = filteredArticles.slice(5);

  const displayLocation = mounted ? selectedLocation : "United States";
  const currentShowcase = showcaseArticles[heroSlideIndex % (showcaseArticles.length || 1)];

  const seenImages = new Set<string>();

  return (
    <div className="min-h-screen bg-[#EBEAE5] text-[#111111] font-sans flex flex-col justify-between selection:bg-[#111111] selection:text-white">
      <div>
        {/* Top Header Navbar */}
        <HomeNavbar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onLocationChange={(loc) => setSelectedLocation(loc)}
          onPreferencesChange={(topics) => setUserTopics(topics)}
          searchQuery={searchQuery}
          onSearchQueryChange={(q) => setSearchQuery(q)}
        />

        {/* Main Content Outer Container */}
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8">
          
          {/* Action & Scraping Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111] pb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#555555]">
                ✦ {activeCategory ? `CATEGORY: ${activeCategory}` : activeTab === "Home" ? "TOP EDITORIAL COVERAGE" : `${activeTab.toUpperCase()} FEED`}
              </span>
              <h1 className="font-syne font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#111111]">
                {activeTab === "Local" ? `LOCAL COVERAGE FOR ${displayLocation.toUpperCase()}` : "TODAY'S EDITORIAL DISPATCH"}
              </h1>
            </div>

            <button
              onClick={handleRunScrape}
              disabled={isScraping}
              className="inline-flex items-center gap-2 bg-[#111111] text-[#EBEAE5] font-mono text-xs uppercase tracking-wider px-4 py-2.5 border border-[#111111] hover:bg-white hover:text-[#111111] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? "animate-spin" : ""}`} />
              <span>{isScraping ? "SCRAPING FRESH NEWS..." : "FETCH FRESH NEWS ✦"}</span>
            </button>
          </div>

          {scrapeMessage && (
            <div className="p-3 bg-white border border-[#111111] font-mono text-xs text-[#111111] font-bold">
              ✦ {scrapeMessage}
            </div>
          )}

          {/* 1. HERO SECTION "TODAY'S NEWS" (Derived strictly from Reference Images) */}
          {filteredArticles.length > 0 && (
            <section className="border-2 border-[#111111] bg-[#F3F2ED] relative overflow-hidden font-mono">
              
              {/* Star / Crosshair corner accents */}
              <span className="absolute top-2 left-2 text-xs text-[#111111] select-none z-10">✦</span>
              <span className="absolute top-2 right-2 text-xs text-[#111111] select-none z-10">✦</span>
              <span className="absolute bottom-2 left-2 text-xs text-[#111111] select-none z-10">✦</span>
              <span className="absolute bottom-2 right-2 text-xs text-[#111111] select-none z-10">✦</span>

              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#111111]">
                
                {/* HERO LEFT COLUMN: Featured Lead Article with Drop Cap */}
                <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="font-syne font-extrabold text-4xl sm:text-5xl uppercase tracking-tighter text-[#111111] leading-none border-b border-[#111111] pb-4">
                      TODAY&apos;S NEWS
                    </h2>

                    {leadArticle && (
                      <div className="space-y-4">
                        <Link href={`/article/${leadArticle.id}`} className="block group">
                          <h3 className="font-syne font-bold text-xl sm:text-2xl uppercase leading-tight text-[#111111] group-hover:underline">
                            {leadArticle.title}
                          </h3>
                        </Link>

                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#555555] border-y border-[#111111] py-1.5 flex flex-wrap gap-2">
                          <span>— {leadArticle.source?.name || "NEWS"}</span>
                          <span>✦</span>
                          <span>BY {leadArticle.source?.name || "REPORTER"}</span>
                          <span>✦</span>
                          <span>{new Date(leadArticle.published_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>

                        {/* Drop Cap Initial Letter Paragraph */}
                        <div className="text-xs text-[#222222] leading-relaxed font-sans drop-cap pt-2 line-clamp-4">
                          {leadArticle.raw_text
                            ? leadArticle.raw_text.replace(/^[^a-zA-Z]+/, "")
                            : "FORTUNATELY FOR THOSE WHO WANT TO READ IN-DEPTH ANALYSIS, OUR AI PIPELINE ANALYZES EVERY DISPATCH FOR SENTIMENT AND FRAMING TRANSPARENCY..."}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lead Featured Framed Image with Corner Ticks */}
                  {leadArticle && (
                    <div className="relative border-2 border-[#111111] bg-white p-2 mt-4">
                      <span className="absolute top-1 left-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌜</span>
                      <span className="absolute top-1 right-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌝</span>
                      <span className="absolute bottom-1 left-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌞</span>
                      <span className="absolute bottom-1 right-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌟</span>
                      <div className="aspect-[16/9] overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-300">
                        <img
                          src={getDistinctArticleImage(leadArticle.id, leadArticle.title, leadArticle.image_url, seenImages)}
                          alt={leadArticle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* HERO CENTER COLUMN: Vertical Top Story Headlines Stack */}
                <div className="lg:col-span-4 p-6 divide-y divide-[#111111] flex flex-col justify-between">
                  <div className="space-y-6 divide-y divide-[#111111]">
                    {centerArticles.map((art) => (
                      <div key={art.id} className="pt-4 first:pt-0 space-y-2 group">
                        <Link href={`/article/${art.id}`} className="block">
                          <h4 className="font-syne font-bold text-sm sm:text-base uppercase leading-snug text-[#111111] group-hover:underline line-clamp-3">
                            {art.title}
                          </h4>
                        </Link>

                        <div className="flex items-center justify-between text-[10px] uppercase text-[#555555] font-mono pt-1">
                          <span>— {art.source?.name || "NEWS"} ✦ BY REPORTERS</span>
                          <Link href={`/article/${art.id}`} className="p-1 border border-[#111111] bg-white group-hover:bg-[#111111] group-hover:text-white transition-colors">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HERO RIGHT COLUMN: Large Showcase Portrait Card with Curved Paper Layer */}
                <div className="lg:col-span-3 p-6 flex flex-col items-center justify-between bg-[#EBEAE5]/80 space-y-4">
                  {currentShowcase && (
                    <div className="w-full space-y-4">
                      {/* Layered Paper Showcase Frame */}
                      <div className="relative w-full">
                        {/* Background Stack Paper Effect */}
                        <div className="absolute inset-0 bg-[#DCDAD4] border border-[#111111] translate-x-2 translate-y-2" />
                        <div className="absolute inset-0 bg-[#C8C6C0] border border-[#111111] translate-x-1 translate-y-1" />

                        {/* Front Main Image Card with Curved Corner */}
                        <div className="relative border-2 border-[#111111] bg-white p-2 shadow-md rounded-br-[28px] overflow-hidden">
                          <div className="aspect-[3/4] overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-300">
                            <img
                              src={getDistinctArticleImage(currentShowcase.id, currentShowcase.title, currentShowcase.image_url, seenImages)}
                              alt={currentShowcase.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Showcase Caption */}
                      <div className="text-center space-y-1 pt-2">
                        <span className="text-[10px] uppercase font-bold text-[#555555]">SHOWCASE STORY</span>
                        <h5 className="font-syne font-bold text-xs uppercase leading-snug text-[#111111] line-clamp-2">
                          {currentShowcase.title}
                        </h5>
                      </div>
                    </div>
                  )}

                  {/* Pagination Slider Controls (< 1 — 5 >) */}
                  <div className="flex items-center gap-3 pt-2 font-mono text-xs uppercase font-bold border-t border-[#111111] w-full justify-center">
                    <button
                      onClick={() => setHeroSlideIndex((prev) => (prev > 0 ? prev - 1 : (showcaseArticles.length || 1) - 1))}
                      className="p-1 border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span>{(heroSlideIndex % (showcaseArticles.length || 1)) + 1} — {showcaseArticles.length || 1}</span>

                    <button
                      onClick={() => setHeroSlideIndex((prev) => (prev + 1) % (showcaseArticles.length || 1))}
                      className="p-1 border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* 2. CONTINUOUS BREAKING NEWS TICKER BAR */}
          <div className="w-full border-y-2 border-[#111111] bg-[#111111] text-[#EBEAE5] font-mono py-2.5 overflow-hidden flex items-center select-none">
            <div className="animate-ticker flex items-center gap-6 text-xs uppercase tracking-widest font-bold">
              {filteredArticles.map((art) => (
                <React.Fragment key={art.id}>
                  <span className="text-red-500 font-extrabold flex items-center gap-1.5">
                    <span>✦ BREAKING NEWS</span>
                  </span>
                  <span className="hover:underline cursor-pointer">
                    {art.title}
                  </span>
                  <span className="text-[#666666]">✦</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 3. SECONDARY BANNER HEADER ("READ UP ON THE LATEST...") */}
          <div className="border-2 border-[#111111] bg-[#F3F2ED] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative font-mono">
            <div className="space-y-2 max-w-3xl">
              <h2 className="font-syne font-extrabold text-3xl sm:text-5xl uppercase tracking-tighter text-[#111111] leading-tight">
                READ UP ON THE <span className="underline decoration-2">LATEST</span> LIFESTYLE AND WORLD NEWS & TIPS ...
              </h2>
            </div>

            {/* Circular Scroll Down Badge */}
            <div className="w-20 h-20 rounded-full border-2 border-[#111111] bg-white flex items-center justify-center text-center p-2 font-mono text-[9px] font-bold uppercase tracking-tighter flex-shrink-0 shadow-sm animate-pulse">
              <span>SCROLL DOWN ✦</span>
            </div>
          </div>

          {/* 4. SECONDARY CATEGORY NEWS CARDS GRID */}
          {filteredArticles.length === 0 ? (
            <div className="border-2 border-[#111111] bg-[#F3F2ED] p-12 text-center space-y-4 font-mono">
              <div className="w-12 h-12 border border-[#111111] bg-white flex items-center justify-center mx-auto text-[#111111]">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="font-syne font-bold text-xl uppercase text-[#111111]">NO DISPATCHES FOUND</h2>
              <p className="text-xs text-[#555555] max-w-md mx-auto">
                No articles currently match your active tab or filter. Try clearing filters or run fresh scraping.
              </p>
              <button
                onClick={() => {
                  setActiveTab("Home");
                  setActiveCategory(null);
                }}
                className="bg-[#111111] text-white px-5 py-2 text-xs uppercase font-bold tracking-wider hover:bg-white hover:text-[#111111] border border-[#111111] transition-all"
              >
                CLEAR ALL FILTERS ✦
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono border-b border-[#111111] pb-2">
                <span className="text-xs uppercase font-bold text-[#111111]">
                  ✦ DISPATCH ARCHIVE ({filteredArticles.length} ARTICLES)
                </span>
                <span className="text-[10px] text-[#555555] uppercase">
                  PAGE 1 OF 1
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((article) => {
                  const analysis = article.analysis;
                  const source = article.source;
                  const distinctImageUrl = getDistinctArticleImage(
                    article.id,
                    article.title,
                    article.image_url,
                    seenImages
                  );

                  return (
                    <HomeNewsCard
                      key={article.id}
                      id={article.id}
                      category={source?.name || "General"}
                      location={displayLocation.split(" ")[0]}
                      title={article.title}
                      imageUrl={distinctImageUrl}
                      leftBias={analysis ? Number(analysis.left_percentage) : 33}
                      centerBias={analysis ? Number(analysis.center_percentage) : 34}
                      rightBias={analysis ? Number(analysis.right_percentage) : 33}
                      sourcesCount={1}
                    />
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Editorial Footer */}
      <HomeFooter />
    </div>
  );
};
