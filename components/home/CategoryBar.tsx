"use client";

import React, { useRef } from "react";
import posthog from "posthog-js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chip } from "../ui/Chip";

const CATEGORIES = [
  "Weather & Climate",
  "World Cup",
  "IPL",
  "Business & Markets",
  "Health & Medicine",
  "Artificial Intelligence",
  "Politics",
  "Technology",
  "Extreme Weather and Disasters",
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
    <div className="w-full bg-[#F0F0F0] dark:bg-[#0F172A] border-b border-[#E5E7EB] dark:border-[#334155] py-2.5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center gap-2">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll Left"
          className="p-1 text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0D0D0F] dark:hover:text-[#F8FAFC] hover:bg-[#E5E7EB] dark:hover:bg-[#1E293B] rounded-full transition-colors flex-shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Scrollable Chips List */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex-shrink-0">
              <Chip
                label={cat}
                active={currentCategory === cat}
                onClick={() => handleSelectCategory(cat)}
                size="sm"
                showIcon={false}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll Right"
          className="p-1 text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0D0D0F] dark:hover:text-[#F8FAFC] hover:bg-[#E5E7EB] dark:hover:bg-[#1E293B] rounded-full transition-colors flex-shrink-0 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
