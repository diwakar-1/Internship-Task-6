"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, MessageSquare, AlertCircle, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

export const LandingPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"summary" | "framing" | "terms">("framing");

  return (
    <section className="w-full bg-[#EBEAE5] py-20 border-b-2 border-[#111111]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        <div className="bg-white border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] overflow-hidden">
          
          {/* Card Top Banner */}
          <div className="bg-[#111111] text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-emerald-500 text-black font-bold uppercase text-[10px]">
                LIVE DEMO PREVIEW
              </span>
              <span className="font-bold tracking-wider text-gray-300">
                SAMPLE ARTICLE ANALYSIS BREAKDOWN
              </span>
            </div>
            <div className="text-gray-400 text-[11px] font-bold flex items-center gap-1.5">
              <span>MODEL: OPENAI GPT-4O-MINI</span>
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>CONFIDENCE: 94%</span>
            </div>
          </div>

          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Sample Article Info */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-2.5 py-1 bg-[#111111] text-white font-bold uppercase">
                  REUTERS
                </span>
                <span className="text-[#666666]">PUBLISHED 2 HOURS AGO</span>
              </div>

              <h3 className="font-syne font-extrabold text-2xl md:text-3xl text-[#111111] uppercase leading-tight">
                Global Clean Energy Transition Accelerates as Solar and Wind Investment Reaches Record Peak
              </h3>

              <p className="font-sans text-sm text-[#444444] leading-relaxed">
                International energy authorities report unprecedented growth in renewable capacity worldwide, driven by updated regulatory policies and technological advancements in grid storage efficiency.
              </p>

              {/* Sample Framing Breakdown Bar */}
              <div className="p-4 bg-[#EBEAE5] border border-[#111111] space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs font-bold uppercase">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    FRAMING SPECTRUM: <span className="text-emerald-700 font-extrabold">CENTER-BALANCED</span>
                  </span>
                  <span className="text-[11px] text-[#666666]">CONFIDENCE: 0.94</span>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full border border-[#111111] bg-white flex overflow-hidden">
                  <div style={{ width: "25%" }} className="bg-blue-600 h-full title='Left: 25%'" />
                  <div style={{ width: "60%" }} className="bg-emerald-500 h-full title='Center: 60%'" />
                  <div style={{ width: "15%" }} className="bg-red-500 h-full title='Right: 15%'" />
                </div>

                <div className="flex justify-between text-[11px] font-bold text-[#333333]">
                  <span className="text-blue-700">LEFT: 25%</span>
                  <span className="text-emerald-700">CENTER: 60%</span>
                  <span className="text-red-700">RIGHT: 15%</span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Tab Inspector */}
            <div className="lg:col-span-6 bg-[#EBEAE5] border-2 border-[#111111] p-6 space-y-6">
              
              {/* Tabs header */}
              <div className="flex border-b-2 border-[#111111] font-mono text-xs font-bold">
                <button
                  onClick={() => setActiveTab("framing")}
                  className={`px-4 py-2.5 uppercase transition-colors border-r-2 border-[#111111] cursor-pointer ${
                    activeTab === "framing" ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-gray-100"
                  }`}
                >
                  Framing Notes
                </button>
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`px-4 py-2.5 uppercase transition-colors border-r-2 border-[#111111] cursor-pointer ${
                    activeTab === "summary" ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-gray-100"
                  }`}
                >
                  Neutral Summary
                </button>
                <button
                  onClick={() => setActiveTab("terms")}
                  className={`px-4 py-2.5 uppercase transition-colors cursor-pointer ${
                    activeTab === "terms" ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-gray-100"
                  }`}
                >
                  Loaded Terms
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[160px] font-sans text-xs sm:text-sm text-[#222222]">
                {activeTab === "framing" && (
                  <div className="space-y-3">
                    <p className="font-semibold text-[#111111]">
                      Analysis Notes on Perspective & Tone:
                    </p>
                    <p className="leading-relaxed text-[#444444]">
                      The coverage heavily emphasizes empirical energy statistics and global panel consensus. The tone remains neutral with balanced citations from economic analysts and policy experts.
                    </p>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 p-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Low sensationalism detected. High factual density.</span>
                    </div>
                  </div>
                )}

                {activeTab === "summary" && (
                  <div className="space-y-3">
                    <p className="font-semibold text-[#111111]">
                      AI Distilled Fact Sheet:
                    </p>
                    <ul className="list-disc pl-4 space-y-2 text-[#444444]">
                      <li>Global clean energy investments hit unprecedented highs in 2026.</li>
                      <li>Solar & wind storage technologies saw efficiency boosts of 18%.</li>
                      <li>Policy frameworks in 35 countries contributed to grid modernization.</li>
                    </ul>
                  </div>
                )}

                {activeTab === "terms" && (
                  <div className="space-y-3">
                    <p className="font-semibold text-[#111111]">
                      Key Editorial Descriptors Highlighted:
                    </p>
                    <div className="flex flex-wrap gap-2 font-mono text-xs">
                      <span className="px-2 py-1 bg-white border border-[#111111] font-bold">"unprecedented growth"</span>
                      <span className="px-2 py-1 bg-white border border-[#111111] font-bold">"regulatory momentum"</span>
                      <span className="px-2 py-1 bg-white border border-[#111111] font-bold">"grid modernization"</span>
                    </div>
                    <p className="font-mono text-[11px] text-[#666666] pt-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#666666] shrink-0" />
                      <span>Terms reflect technical industry nomenclature rather than emotional rhetoric.</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button to Open Newsroom */}
              <div className="pt-4 border-t border-[#111111] flex justify-end font-mono">
                <Link href="/feed" target="_blank" rel="noopener noreferrer">
                  <button className="px-5 py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider border border-[#111111] shadow-[3px_3px_0px_0px_#888888] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#888888] transition-all flex items-center gap-2 cursor-pointer">
                    <span>SEE LIVE ARTICLES IN NEWSROOM</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
