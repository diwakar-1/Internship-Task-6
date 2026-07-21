"use client";

import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Info } from "lucide-react";
import { BiasMeter } from "../ui/BiasMeter";

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
  onInfoClick,
}) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] shadow-ds-sm hover:shadow-ds-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <Link
        href={`/article/${id}`}
        className="block"
        onClick={() =>
          posthog.capture("article_opened", {
            article_id: String(id),
            category,
            sources_count: sourcesCount,
          })
        }
      >
        {/* Top Thumbnail Image */}
        <div className="relative aspect-[16/10] bg-[#F6F6F6] dark:bg-[#0F172A] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Info Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onInfoClick) onInfoClick();
            }}
            aria-label="Info"
            className="absolute top-2.5 right-2.5 bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm p-1.5 rounded-full transition-all cursor-pointer z-10"
          >
            <Info className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Category · Location Tag */}
          <div className="text-[11px] font-semibold text-[#6B7280] dark:text-[#94A3B8] tracking-wide font-poppins">
            <span>{category}</span>
            <span className="mx-1">·</span>
            <span>{location}</span>
          </div>

          {/* Headline Title */}
          <h3 className="font-bold text-[17px] text-[#0D0D0F] dark:text-[#F8FAFC] leading-snug font-poppins group-hover:text-[#1D4ED8] dark:group-hover:text-blue-400 transition-colors line-clamp-3 min-h-[50px]">
            {title}
          </h3>
        </div>
      </Link>

      {/* Card Footer: Bias Meter & Source Count */}
      <div className="px-4 pb-4 pt-1 space-y-3">
        {/* 3-Segment Bias Meter */}
        <BiasMeter
          left={leftBias}
          center={centerBias}
          right={rightBias}
          size="sm"
          showLabels={true}
        />

        {/* Sources Count */}
        <div className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-normal font-poppins pt-1">
          {sourcesCount} {sourcesCount === 1 ? "source" : "sources"}
        </div>
      </div>
    </div>
  );
};
