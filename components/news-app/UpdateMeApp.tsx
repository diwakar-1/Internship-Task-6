"use client";

import React, { useState } from "react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { ArticleCard } from "../ui/ArticleCard";
import { Search, Bell, Bookmark, TrendingUp, Sparkles, Filter } from "lucide-react";

const SAMPLE_ARTICLES = [
  {
    id: 1,
    category: "Politics",
    region: "United States",
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    summary: "The proposal includes stricter limits on uranium enrichment and enhanced verification measures.",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
    leftBias: 25,
    centerBias: 50,
    rightBias: 49,
    timeAgo: "2h ago",
    readTime: "12 min read",
    biasCategory: "Balanced",
  },
  {
    id: 2,
    category: "Business & Markets",
    region: "Global Economics",
    title: "Central Banks Signal Synchronized Rate Cuts Amid Slowing Inflation Trends",
    summary: "Global markets rally as monetary authorities hint at monetary easing cycles across major Western economies.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    leftBias: 15,
    centerBias: 70,
    rightBias: 15,
    timeAgo: "4h ago",
    readTime: "8 min read",
    biasCategory: "Center",
  },
  {
    id: 3,
    category: "Technology",
    region: "Silicon Valley",
    title: "AI Regulatory Framework Passed by Parliament with Strict Compliance Standards",
    summary: "Lawmakers finalize groundbreaking guidelines requiring transparency in automated decision engines.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    leftBias: 55,
    centerBias: 35,
    rightBias: 10,
    timeAgo: "5h ago",
    readTime: "10 min read",
    biasCategory: "Left",
  },
  {
    id: 4,
    category: "World Cup",
    region: "Sports",
    title: "Global Football Confederation Announces Expanded 48-Team Tournament Format",
    summary: "New venue allocations and qualifying slots spark debate among national federations worldwide.",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    leftBias: 10,
    centerBias: 80,
    rightBias: 10,
    timeAgo: "6h ago",
    readTime: "6 min read",
    biasCategory: "Center",
  },
];

export const UpdateMeApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [biasFilter, setBiasFilter] = useState<string>("All");

  const categories = ["All", "World Cup", "IPL", "Business & Markets", "Politics", "Technology"];

  const filteredArticles = SAMPLE_ARTICLES.filter((article) => {
    const matchesCategory = activeCategory === "All" || article.category.includes(activeCategory);
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBias =
      biasFilter === "All" ||
      (biasFilter === "Left" && article.leftBias > 40) ||
      (biasFilter === "Center" && article.centerBias >= 50) ||
      (biasFilter === "Right" && article.rightBias > 40);

    return matchesCategory && matchesSearch && matchesBias;
  });

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#0D0D0F] font-poppins pb-12">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-ds-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo size="sm" showTagline={false} />
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Bias Analysis Active</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2]" />
            <input
              type="text"
              placeholder="Search unbiased news topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F6F6F6] text-xs font-poppins pl-10 pr-4 py-2 rounded-full border border-[#E5E7EB] focus:outline-none focus:border-[#0D0D0F] focus:bg-white transition-all"
            />
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-[#F6F6F6] text-[#6B7280] hover:text-[#0D0D0F] transition-colors relative">
              <Bell className="w-4 h-4 stroke-[2]" />
              <span className="w-2 h-2 bg-[#B42318] rounded-full absolute top-1.5 right-1.5" />
            </button>
            <button className="p-2 rounded-full hover:bg-[#F6F6F6] text-[#6B7280] hover:text-[#0D0D0F] transition-colors">
              <Bookmark className="w-4 h-4 stroke-[2]" />
            </button>
            <Button variant="primary" stateVariant="default" className="text-xs px-4 py-1.5">
              Subscribe
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Banner Section */}
        <div className="bg-[#0D0D0F] text-white rounded-[16px] p-6 sm:p-8 relative overflow-hidden shadow-ds-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl z-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
              Update Me News Platform
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight font-poppins">
              Multi-Source News Analysis & Framing Transparency
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
              Every headline is analyzed across political spectrums using advanced AI sentiment detection.
            </p>
          </div>
          <div className="z-10 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              stateVariant="default"
              className="bg-white text-[#0D0D0F] text-xs font-semibold px-4 py-2 hover:bg-gray-100"
              onClick={() => setBiasFilter("All")}
            >
              Show All Feeds
            </Button>
          </div>
        </div>

        {/* Filters and Category Chips Row */}
        <div className="bg-white rounded-[12px] p-4 border border-[#E5E7EB] shadow-ds-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mr-1">
              Categories:
            </span>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                showIcon={cat !== "All"}
              />
            ))}
          </div>

          {/* Bias Filter Pills */}
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0F0F0]">
            <Filter className="w-3.5 h-3.5 text-[#6B7280] stroke-[2]" />
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Filter Bias:
            </span>
            <div className="flex bg-[#F6F6F6] p-1 rounded-full border border-[#E5E7EB]">
              {["All", "Left", "Center", "Right"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setBiasFilter(filter)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${
                    biasFilter === filter
                      ? "bg-[#0D0D0F] text-white shadow-ds-sm"
                      : "text-[#6B7280] hover:text-[#0D0D0F]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News Feed Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0D0D0F] flex items-center gap-2 font-poppins">
              <TrendingUp className="w-5 h-5 text-[#1D4ED8]" />
              <span>Trending Balanced Coverage</span>
            </h2>
            <span className="text-xs font-medium text-[#6B7280]">
              Showing {filteredArticles.length} analyzed stories
            </span>
          </div>

          {/* Articles list */}
          <div className="grid grid-cols-1 gap-4">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                category={article.category}
                region={article.region}
                title={article.title}
                summary={article.summary}
                imageUrl={article.imageUrl}
                leftBias={article.leftBias}
                centerBias={article.centerBias}
                rightBias={article.rightBias}
                timeAgo={article.timeAgo}
                readTime={article.readTime}
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
