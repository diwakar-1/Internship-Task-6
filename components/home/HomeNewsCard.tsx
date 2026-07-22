"use client";

import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { ArrowUpRight } from "lucide-react";

export interface HomeNewsCardProps {
  id?: number | string;
  category: string;
  location: string;
  title: string;
  imageUrl: string;
  leftBias: number;
  centerBias: number;
  rightBias: number;
  sourcesCount: number;
  onInfoClick?: () => void;
}

export const HomeNewsCard: React.FC<HomeNewsCardProps> = ({
  id = 1,
  category,
  location,
  title,
  imageUrl,
  leftBias,
  centerBias,
  rightBias,
  sourcesCount,
}) => {
  return (
    <div className="bg-[#F3F2ED] border-2 border-[#111111] flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#111111] relative overflow-hidden font-mono">
      
      {/* Corner crosshairs tick marks */}
      <span className="absolute top-1 left-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌜</span>
      <span className="absolute top-1 right-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌝</span>
      <span className="absolute bottom-1 left-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌞</span>
      <span className="absolute bottom-1 right-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌟</span>

      <Link
        href={`/article/${id}`}
        className="block flex-1"
        onClick={() =>
          posthog.capture("article_opened", {
            article_id: String(id),
            category,
            sources_count: sourcesCount,
          })
        }
      >
        {/* Top Image Frame */}
        <div className="p-3 border-b border-[#111111]">
          <div className="relative aspect-[16/10] bg-[#EBEAE5] border border-[#111111] overflow-hidden grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          {/* Metadata Line */}
          <div className="text-[10px] font-bold text-[#555555] uppercase tracking-wider flex items-center justify-between">
            <span>— {category} ✦ {location}</span>
            <ArrowUpRight className="w-4 h-4 text-[#111111] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          {/* Headline Title */}
          <h3 className="font-extrabold text-base text-[#111111] leading-tight font-syne uppercase tracking-tight line-clamp-3 group-hover:underline">
            {title}
          </h3>
        </div>
      </Link>

      {/* Card Footer: AI Framing Meter & Source Info */}
      <div className="px-4 pb-4 pt-2 border-t border-[#111111] bg-[#EBEAE5]/60 space-y-2">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#333333]">
          <span>AI Framing</span>
          <span>L {leftBias}% · C {centerBias}% · R {rightBias}%</span>
        </div>

        {/* 3-Segment Bias Bar */}
        <div className="w-full h-2 border border-[#111111] flex overflow-hidden bg-white">
          <div style={{ width: `${leftBias}%` }} className="bg-[#B42318] h-full" title={`Left: ${leftBias}%`} />
          <div style={{ width: `${centerBias}%` }} className="bg-[#888888] h-full" title={`Center: ${centerBias}%`} />
          <div style={{ width: `${rightBias}%` }} className="bg-[#1D4ED8] h-full" title={`Right: ${rightBias}%`} />
        </div>
      </div>
    </div>
  );
};
