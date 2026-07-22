"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const LandingHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#EBEAE5] text-[#111111] font-mono border-b-2 border-[#111111] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Logo size="sm" showTagline={false} />
        </Link>

        {/* Center/Right Status & Launch Action */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white border border-[#111111] text-[11px] font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-[#111111]" />
            <span>LIVE NEWS PLATFORM</span>
          </div>

          <Link href="/feed" target="_blank" rel="noopener noreferrer">
            <button className="px-5 py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-widest border-2 border-[#111111] shadow-[3px_3px_0px_0px_#888888] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#888888] transition-all flex items-center gap-2 cursor-pointer">
              <span>LAUNCH NEWSROOM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </header>
  );
};
