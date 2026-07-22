"use client";

import React, { useRef } from "react";
import posthog from "posthog-js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  "Weather & Climate",
  "World Cup",
  "IPL",
  "Business & Markets",
  "Health & Medicine",
  "Artificial Intelligence",
  "Politics",
  "Technology",
  "Extreme Weather",
];

interface CategoryBarProps {
  activeCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory: externalActiveCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [internalCategory, setInternalCategory] = React.useState<string | null>(null);

  const currentCategory = externalActiveCategory !== undefined ? externalActiveCategory : internalCategory;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSelectCategory = (category: string) => {
    const nextCategory = currentCategory === category ? null : category;
    setInternalCategory(nextCategory);
    if (onSelectCategory) onSelectCategory(nextCategory);
    posthog.capture("category_filter_changed", {
      category: nextCategory ?? "all",
      filter_cleared: nextCategory === null,
    });
  };

  return (
    <div className="w-full bg-[#EBEAE5] border-b border-[#111111] py-2 font-mono">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center gap-2">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll Left"
          className="p-1 border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors flex-shrink-0 cursor-pointer bg-white/50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Chips List */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`flex-shrink-0 px-3 py-1 text-[11px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white/40 text-[#111111] border-[#111111] hover:bg-[#111111] hover:text-white"
                }`}
              >
                <span>{cat}</span>
                {isActive && <span className="ml-1 text-xs">✦</span>}
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll Right"
          className="p-1 border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors flex-shrink-0 cursor-pointer bg-white/50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
