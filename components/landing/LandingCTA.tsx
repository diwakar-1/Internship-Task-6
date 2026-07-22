"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper, Shield, Sparkles } from "lucide-react";

export const LandingCTA: React.FC = () => {
  return (
    <section className="w-full bg-[#111111] text-white py-20 border-b-2 border-[#111111] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EBEAE5] text-[#111111] border border-white font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>EXPERT-GRADE NEWS ANALYSIS ACCESSIBLE TO ALL</span>
          </div>

          <h2 className="font-syne font-extrabold text-4xl sm:text-6xl uppercase tracking-tight leading-[0.95] text-white">
            READY TO READ NEWS WITH COMPLETE TRANSPARENCY?
          </h2>

          <p className="font-sans text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Step into the Update You newsroom. Filter by category, inspect sentiment scores, explore bias framing ratios, and compare coverage across global sources.
          </p>

          {/* Big CTA Button */}
          <div className="pt-4 font-mono flex justify-center">
            <Link href="/feed" target="_blank" rel="noopener noreferrer">
              <button className="px-10 py-5 bg-white text-[#111111] font-extrabold text-base uppercase tracking-widest border-2 border-white shadow-[6px_6px_0px_0px_#444444] hover:bg-[#EBEAE5] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#444444] transition-all flex items-center gap-3 cursor-pointer">
                <span>ENTER LIVE NEWSROOM NOW</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 font-mono text-xs text-gray-400 uppercase font-bold border-t border-gray-800 max-w-xl mx-auto">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              NO BIAS HIDDEN
            </span>
            <span className="flex items-center gap-1.5">
              <Newspaper className="w-4 h-4 text-blue-400" />
              REAL-TIME SOURCES
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              AI POWERED
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
