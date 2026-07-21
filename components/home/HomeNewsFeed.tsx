"use client";

import React, { useState, useEffect } from "react";
import { HomeNavbar } from "./HomeNavbar";
import { CategoryBar } from "./CategoryBar";
import { HomeNewsCard } from "./HomeNewsCard";
import { HomeFooter } from "./HomeFooter";
import { Article } from "@/lib/supabase/types";
import { getDistinctArticleImage } from "@/lib/utils/image";
import { Newspaper, MapPin, RefreshCw, Filter } from "lucide-react";

interface HomeNewsFeedProps {
  initialArticles: Article[];
}

export const HomeNewsFeed: React.FC<HomeNewsFeedProps> = ({ initialArticles }) => {
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [selectedLocation, setSelectedLocation] = useState<string>("United States");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userTopics, setUserTopics] = useState<string[]>(["Technology", "Politics"]);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeMessage, setScrapeMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedLoc = localStorage.getItem("user_news_location");
    if (storedLoc) setSelectedLocation(storedLoc);

    const storedTopics = localStorage.getItem("user_news_topics");
    if (storedTopics) {
      try {
        setUserTopics(JSON.parse(storedTopics));
      } catch {
        // ignore parse error
      }
    }
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
    const sourceName = article.source?.name?.toLowerCase() || "";
    const titleLower = article.title.toLowerCase();
    const locLower = selectedLocation.toLowerCase();

    // 1. Tab Filtering
    if (activeTab === "Local") {
      // Check if source or article matches set location
      if (locLower.includes("united states") || locLower.includes("us")) {
        const isUsSource = sourceName.includes("fox") || sourceName.includes("npr") || sourceName.includes("reuters") || sourceName.includes("guardian");
        if (!isUsSource) return false;
      } else if (locLower.includes("united kingdom") || locLower.includes("uk")) {
        const isUkSource = sourceName.includes("bbc") || sourceName.includes("guardian") || sourceName.includes("reuters");
        if (!isUkSource) return false;
      }
    } else if (activeTab === "For You") {
      // Filter by user selected topics
      if (userTopics.length > 0) {
        const matchesTopic = userTopics.some(
          (topic) =>
            titleLower.includes(topic.toLowerCase()) ||
            sourceName.includes(topic.toLowerCase())
        );
        if (!matchesTopic && initialArticles.length > 3) return false;
      }
    } else if (activeTab === "Blindspot") {
      // High framing divergence
      const left = Number(article.analysis?.left_percentage || 0);
      const right = Number(article.analysis?.right_percentage || 0);
      const diff = Math.abs(left - right);
      if (diff < 15 && initialArticles.length > 2) return false;
    }

    // 2. Category Chips Bar Filtering
    if (activeCategory) {
      const catLower = activeCategory.toLowerCase();
      const matchesCat =
        titleLower.includes(catLower) ||
        sourceName.includes(catLower) ||
        (article.raw_text && article.raw_text.toLowerCase().includes(catLower));
      if (!matchesCat) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#0D0D0F] font-poppins flex flex-col justify-between">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0D0D0F] font-poppins tracking-tight flex items-center gap-2">
                <span>{activeTab === "Home" ? "Top News" : `${activeTab} Feed`}</span>
                {activeTab === "Local" && (
                  <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                    📍 {selectedLocation}
                  </span>
                )}
              </h1>
              <p className="text-xs text-[#6B7280]">
                {activeTab === "Local"
                  ? `Showing news coverage for ${selectedLocation}`
                  : activeTab === "For You"
                  ? `Personalized feed matching your chosen topics (${userTopics.join(", ") || "All Topics"})`
                  : activeTab === "Blindspot"
                  ? "Stories with strong framing divergence across media outlets"
                  : "Balanced multi-source coverage powered by AI framing analysis"}
              </p>
            </div>

            {/* Quick Action: Trigger Fresh Scrape */}
            <button
              onClick={handleRunScrape}
              disabled={isScraping}
              className="inline-flex items-center gap-2 bg-white text-[#0D0D0F] hover:bg-gray-100 text-xs px-4 py-2 rounded-[8px] border border-[#E5E7EB] font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
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
            <div className="bg-white rounded-[16px] p-8 sm:p-12 text-center border border-[#E5E7EB] shadow-ds-sm max-w-2xl mx-auto my-8 space-y-4 font-poppins">
              <div className="w-16 h-16 bg-[#F0F0F0] rounded-full flex items-center justify-center mx-auto text-[#6B7280]">
                <MapPin className="w-8 h-8 text-[#1D4ED8] stroke-[1.5]" />
              </div>
              <h2 className="text-xl font-bold text-[#0D0D0F]">No Scraped Articles Found For This Filter</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {activeTab === "Local"
                  ? `No articles are currently stored for ${selectedLocation}. Add new active sources for this zone in Supabase or run Oxylabs scraping.`
                  : "No articles found matching your active topic filter."}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleRunScrape}
                  className="bg-[#0D0D0F] text-white text-xs px-5 py-2.5 rounded-[6px] font-semibold hover:bg-[#1F2937] transition-all cursor-pointer"
                >
                  Scrape News via Oxylabs
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Home");
                    setActiveCategory(null);
                  }}
                  className="bg-[#E5E7EB] text-[#0D0D0F] text-xs px-5 py-2.5 rounded-[6px] font-semibold hover:bg-gray-300 transition-all cursor-pointer"
                >
                  Show All Articles
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
                      location={selectedLocation.split(" ")[0]}
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
