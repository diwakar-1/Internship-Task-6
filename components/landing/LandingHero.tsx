"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Newspaper, Compass } from "lucide-react";
import { Article } from "@/lib/supabase/types";

interface LandingHeroProps {
  previewArticles?: Article[];
}

export const LandingHero: React.FC<LandingHeroProps> = ({ previewArticles = [] }) => {
  const tickerItems = previewArticles.length > 0 
    ? previewArticles.slice(0, 5)
    : [
        { title: "Global AI Ethics Standards Proposed by International Panel", source: "REUTERS", sentiment: "NEUTRAL", bias: "CENTER" },
        { title: "Markets React to Federal Reserve Rate Announcement", source: "BBC NEWS", sentiment: "POSITIVE", bias: "SLIGHT RIGHT" },
        { title: "Renewable Energy Capacity Reaches Record High Worldwide", source: "NPR", sentiment: "POSITIVE", bias: "SLIGHT LEFT" },
      ];

  return (
    <section className="w-full bg-[#EBEAE5] text-[#111111] border-b-2 border-[#111111] pt-10 pb-16 relative overflow-hidden">
      {/* Background Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI-Powered News Transparency & Framing Intelligence</span>
          </div>
        </div>

        {/* Hero Main Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="font-syne font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-[0.95] text-[#111111]">
            UNCOVER THE <span className="underline decoration-4 decoration-[#111111] underline-offset-8">FRAMING</span> BEHIND THE HEADLINES
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#444444] max-w-2xl mx-auto leading-relaxed">
            Update You automatically ingests global news, runs deep AI sentiment & political bias scoring, and empowers readers with balanced, transparent perspectives.
          </p>

          {/* Call To Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono">
            <Link href="/feed" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#111111] text-white font-bold text-sm uppercase tracking-widest border-2 border-[#111111] shadow-[5px_5px_0px_0px_#888888] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#888888] transition-all flex items-center justify-center gap-3 cursor-pointer">
                <span>EXPLORE LIVE NEWSROOM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <a href="#how-it-works" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#111111] font-bold text-sm uppercase tracking-widest border-2 border-[#111111] shadow-[5px_5px_0px_0px_#111111] hover:bg-[#111111] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Compass className="w-4 h-4" />
                <span>HOW IT WORKS</span>
              </button>
            </a>
          </div>
        </div>

        {/* Feature Pill Matrix */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto font-mono text-xs uppercase font-bold text-center">
          <div className="p-3 bg-white/80 border border-[#111111] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#111111]" />
            <span>AI Framing Meter</span>
          </div>
          <div className="p-3 bg-white/80 border border-[#111111] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#111111]" />
            <span>Multi-Outlet Scraping</span>
          </div>
          <div className="p-3 bg-white/80 border border-[#111111] flex items-center justify-center gap-2">
            <Newspaper className="w-4 h-4 text-[#111111]" />
            <span>Neutral Summaries</span>
          </div>
          <div className="p-3 bg-white/80 border border-[#111111] flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 text-[#111111]" />
            <span>Vector Similarities</span>
          </div>
        </div>

        {/* Animated Live Headlines Ticker */}
        <div className="mt-12 border-2 border-[#111111] bg-white overflow-hidden shadow-[4px_4px_0px_0px_#111111]">
          <div className="bg-[#111111] text-white px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE SCANNED HEADLINES & SENTIMENT
            </span>
            <span className="hidden sm:inline text-gray-400">UPDATED HOURLY</span>
          </div>

          <div className="py-3 px-4 overflow-hidden relative">
            <div className="animate-ticker flex items-center gap-8 font-mono text-xs">
              {tickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 shrink-0">
                  <span className="bg-[#111111] text-white text-[10px] px-2 py-0.5 font-bold uppercase">
                    {(item as any).source?.name || (item as any).source || "NEWS"}
                  </span>
                  <span className="font-bold text-[#111111] max-w-md truncate">
                    {item.title}
                  </span>
                  <span className="border border-[#111111] px-1.5 py-0.5 text-[10px] font-bold bg-[#EBEAE5]">
                    {(item as any).analysis?.sentiment_label?.toUpperCase() || (item as any).sentiment || "ANALYZED"}
                  </span>
                  <Sparkles className="w-3 h-3 text-[#888888]" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
