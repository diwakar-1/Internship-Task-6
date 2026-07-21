import React, { useState } from "react";
import { Clock, Bookmark, Info } from "lucide-react";
import { BiasMeter } from "./BiasMeter";

export interface ArticleCardProps {
  category?: string;
  region?: string;
  title?: string;
  summary?: string;
  imageUrl?: string;
  leftBias?: number;
  centerBias?: number;
  rightBias?: number;
  timeAgo?: string;
  readTime?: string;
  onInfoClick?: () => void;
  onBookmarkClick?: () => void;
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  category = "Politics",
  region = "United States",
  title = "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
  summary = "The proposal includes stricter limits on uranium enrichment and enhanced verification measures.",
  imageUrl = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  leftBias = 25,
  centerBias = 50,
  rightBias = 49,
  timeAgo = "2h ago",
  readTime = "12 min read",
  onInfoClick,
  onBookmarkClick,
  className = "",
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmarkClick) onBookmarkClick();
  };

  return (
    <div
      className={`bg-white rounded-[12px] border border-[#E5E7EB] p-4 sm:p-5 shadow-ds-sm hover:shadow-ds-md transition-all duration-200 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 ${className}`}
    >
      {/* Left: Image Container */}
      <div className="md:col-span-5 relative group overflow-hidden rounded-[8px] aspect-[4/3] bg-[#F6F6F6]">
        {/* Article Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Info Icon Button on Image */}
        <button
          onClick={onInfoClick}
          aria-label="Article info"
          className="absolute top-2.5 right-2.5 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm p-1.5 rounded-full transition-all duration-150 cursor-pointer"
        >
          <Info className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Right: Content Column */}
      <div className="md:col-span-7 flex flex-col justify-between space-y-3">
        <div>
          {/* Category · Region Metadata */}
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1 font-poppins flex items-center gap-1.5">
            <span>{category}</span>
            <span>·</span>
            <span>{region}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[18px] sm:text-[20px] text-[#0D0D0F] leading-snug font-poppins mb-2 hover:text-[#1D4ED8] transition-colors cursor-pointer line-clamp-2">
            {title}
          </h3>

          {/* Description / Summary */}
          <p className="text-[#6B7280] text-xs sm:text-sm font-poppins leading-relaxed line-clamp-2 mb-3">
            {summary}
          </p>
        </div>

        <div>
          {/* Bias Meter Bar */}
          <div className="mb-3.5">
            <BiasMeter
              left={leftBias}
              center={centerBias}
              right={rightBias}
              size="sm"
            />
          </div>

          {/* Card Footer Row */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] font-poppins pt-2 border-t border-[#F0F0F0]">
            {/* Time Ago */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 stroke-[2]" />
              <span>{timeAgo}</span>
            </div>

            {/* Read Time & Bookmark */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Bookmark
                  className={`w-3.5 h-3.5 stroke-[2] cursor-pointer transition-colors ${
                    isBookmarked ? "fill-[#0D0D0F] text-[#0D0D0F]" : "hover:text-[#0D0D0F]"
                  }`}
                  onClick={handleBookmark}
                />
                <span>{readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
