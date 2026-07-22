"use client";

import React from "react";
import { Cpu, Scale, Search, Layers, RefreshCw, BarChart3, Database, Eye, Sparkles } from "lucide-react";

export const LandingFeatures: React.FC = () => {
  const features = [
    {
      step: "01",
      icon: RefreshCw,
      title: "AUTOMATED MULTI-SOURCE SCRAPING",
      subtitle: "Hourly Oxylabs & Vercel Cron Pipeline",
      description:
        "Update You connects directly to top global news organizations (BBC, Reuters, NPR, Fox News) using scheduled scraping jobs to fetch stories directly from live homepages.",
      highlight: "Clean data without paywalls or filler ads",
    },
    {
      step: "02",
      icon: Cpu,
      title: "AI SENTIMENT & BIAS ANALYSIS",
      subtitle: "Vercel AI SDK & OpenAI Analysis Engine",
      description:
        "Every article undergoes automatic LLM analysis to distill neutral facts, evaluate tone, extract loaded phrasing, and generate bias disclosures.",
      highlight: "Objective neutral summaries in seconds",
    },
    {
      step: "03",
      icon: Scale,
      title: "FRAMING & BIAS SPECTRUM",
      subtitle: "Left / Center / Right Ratio Indicators",
      description:
        "Instead of simple labels, we calculate exact political framing percentages so you can see where an article leans and why.",
      highlight: "Transparent percentage spectrum on every card",
    },
    {
      step: "04",
      icon: Database,
      title: "SEMANTIC VECTOR SEARCH",
      subtitle: "Supabase pgvector (1536-dim Embeddings)",
      description:
        "Powered by pgvector embeddings to uncover related coverage across multiple outlets, allowing readers to compare different perspectives side-by-side.",
      highlight: "Discover how distinct outlets cover the same event",
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#EBEAE5] py-20 border-b-2 border-[#111111]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-6 border-b border-[#111111]">
          <div>
            <div className="font-mono text-xs uppercase font-bold text-[#555555] tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#111111]" />
              SYSTEM ARCHITECTURE & CAPABILITIES
            </div>
            <h2 className="font-syne font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-[#111111]">
              WHAT IS UPDATE YOU FOR?
            </h2>
          </div>
          <p className="font-sans text-sm text-[#555555] max-w-md">
            Built to provide absolute clarity in news consumption by breaking down bias, sentiment, and editorial framing through AI automation.
          </p>
        </div>

        {/* 4-Grid Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white border-2 border-[#111111] p-6 shadow-[5px_5px_0px_0px_#111111] flex flex-col justify-between hover:-translate-y-1 transition-all group"
              >
                <div>
                  {/* Top Bar with Step & Icon */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#111111] font-mono">
                    <span className="text-2xl font-extrabold text-[#111111] font-syne">{item.step}</span>
                    <div className="p-2 bg-[#EBEAE5] border border-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-syne font-bold text-lg uppercase tracking-tight text-[#111111] mb-1">
                    {item.title}
                  </h3>
                  <div className="font-mono text-[11px] font-bold text-[#666666] uppercase mb-4">
                    {item.subtitle}
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs text-[#333333] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Highlight Footer */}
                <div className="pt-3 border-t border-dashed border-[#cccccc] font-mono text-[11px] font-bold text-[#111111] uppercase flex items-center gap-1.5 bg-[#EBEAE5]/50 p-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
