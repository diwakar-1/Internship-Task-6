"use client";

import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Article } from "@/lib/supabase/types";

interface RelatedStoriesProps {
  articles?: Article[];
}

export const RelatedStories: React.FC<RelatedStoriesProps> = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-6 border-t border-[#E5E7EB] font-poppins">
      <h3 className="text-lg font-bold text-[#0D0D0F]">Related Stories</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((story) => {
          const dateStr = story.published_date
            ? new Date(story.published_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent";

          return (
            <Link
              key={story.id}
              href={`/article/${story.id}`}
              onClick={() =>
                posthog.capture("related_story_selected", {
                  article_id: story.id,
                  source_name: story.source?.name || "News",
                })
              }
              className="flex items-center gap-3 p-2.5 rounded-[8px] border border-transparent hover:border-[#E5E7EB] hover:bg-white transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="w-20 h-16 rounded-[6px] bg-[#F6F6F6] overflow-hidden flex-shrink-0">
                <img
                  src={story.image_url}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="text-[10px] font-semibold text-[#6B7280]">
                  <span>{story.source?.name || "News"}</span>
                  <span className="mx-1">·</span>
                  <span>Similar Story</span>
                </div>
                <h4 className="text-xs font-bold text-[#0D0D0F] leading-snug line-clamp-2 group-hover:text-[#1D4ED8] transition-colors">
                  {story.title}
                </h4>
                <div className="text-[10px] text-[#6B7280]">
                  <span>{dateStr}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
