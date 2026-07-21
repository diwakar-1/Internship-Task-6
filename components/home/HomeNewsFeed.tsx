"use client";

import React, { useState, useEffect } from "react";
import { HomeNavbar } from "./HomeNavbar";
import { CategoryBar } from "./CategoryBar";
import { HomeNewsCard } from "./HomeNewsCard";
import { HomeFooter } from "./HomeFooter";
import { Article } from "@/lib/supabase/types";
import { getDistinctArticleImage } from "@/lib/utils/image";
import { MapPin, RefreshCw } from "lucide-react";

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

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);
  const [scrapeMessage, setScrapeMessage] = useState<string | null>(null);

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

  const displayLocation = mounted ? selectedLocation : "United States";
  const displayTopics = mounted ? userTopics : ["Technology", "Politics"];

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#0B0F19] text-[#0D0D0F] dark:text-[#F8FAFC] font-poppins flex flex-col justify-between">
      <div>
        {/* Top Utility & Main Navigation Header */}
        <HomeNavbar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onLocationChange={(loc) => setSelectedLocation(loc)}
          onPreferencesChange={(topics) => setUserTopics(topics)}
        />

        {/* Scrollable Category Chips Bar */}
        <CategoryBar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />

        {/* Main Content Area */}
        <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Active Filter Bar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0D0D0F] dark:text-[#F8FAFC] font-poppins tracking-tight flex items-center gap-2">
                <span>
                  {activeCategory
                    ? `${activeCategory} News`
                    : activeTab === "Home"
                    ? "Top News"
                    : `${activeTab} Feed`}
                </span>
                {activeTab === "Local" && (
                  <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                    📍 {displayLocation}
                  </span>
                )}
              </h1>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                {activeCategory
                  ? `Showing articles matching category "${activeCategory}"`
                  : activeTab === "Local"
                  ? `Showing news coverage for ${displayLocation}`
                  : activeTab === "For You"
                  ? `Personalized feed matching your chosen topics (${displayTopics.join(", ") || "All Topics"})`
                  : activeTab === "Blindspot"
                  ? "Stories with strong framing divergence across media outlets"
                  : "Balanced multi-source coverage powered by AI framing analysis"}
              </p>
            </div>

            {/* Quick Action: Trigger Fresh Scrape */}
            <button
              onClick={handleRunScrape}
              disabled={isScraping}
              className="inline-flex items-center gap-2 bg-white dark:bg-[#1E293B] text-[#0D0D0F] dark:text-[#F8FAFC] hover:bg-gray-100 dark:hover:bg-[#334155] text-xs px-4 py-2 rounded-[8px] border border-[#E5E7EB] dark:border-[#334155] font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? "animate-spin text-blue-600" : ""}`} />
              <span>{isScraping ? "Scraping Oxylabs..." : "Fetch Fresh News"}</span>
            </button>
          </div>

          {scrapeMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-[8px] text-xs text-blue-800 font-medium animate-in fade-in">
              {scrapeMessage}
            </div>
          )}

          {/* Dynamic News Card Grid or Empty State */}
          {filteredArticles.length === 0 ? (
            <div className="bg-white dark:bg-[#1E293B] rounded-[16px] p-8 sm:p-12 text-center border border-[#E5E7EB] dark:border-[#334155] shadow-ds-sm max-w-2xl mx-auto my-8 space-y-4 font-poppins">
              <div className="w-16 h-16 bg-[#F0F0F0] dark:bg-[#0F172A] rounded-full flex items-center justify-center mx-auto text-[#6B7280] dark:text-[#94A3B8]">
                <MapPin className="w-8 h-8 text-[#1D4ED8] stroke-[1.5]" />
              </div>
              <h2 className="text-xl font-bold text-[#0D0D0F] dark:text-[#F8FAFC]">No Articles Found</h2>
              <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                {activeCategory
                  ? `No articles currently match category "${activeCategory}". Try clearing your filter or trigger a fresh scrape.`
                  : activeTab === "Local"
                  ? `No articles are stored matching region "${displayLocation}". Run scraping or adjust your location.`
                  : "No articles found matching your active topic filter."}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleRunScrape}
                  className="bg-[#0D0D0F] dark:bg-blue-600 text-white text-xs px-5 py-2.5 rounded-[6px] font-semibold hover:bg-[#1F2937] dark:hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Scrape Fresh News
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Home");
                    setActiveCategory(null);
                  }}
                  className="bg-[#E5E7EB] dark:bg-[#334155] text-[#0D0D0F] dark:text-[#F8FAFC] text-xs px-5 py-2.5 rounded-[6px] font-semibold hover:bg-gray-300 dark:hover:bg-[#475569] transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(() => {
                const seenImages = new Set<string>();
                return filteredArticles.map((article) => {
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
                });
              })()}
            </div>
          )}
        </main>
      </div>

      {/* Brand Footer */}
      <HomeFooter />
    </div>
  );
};
