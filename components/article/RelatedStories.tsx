"use client";

import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Article } from "@/lib/supabase/types";
import { getDistinctArticleImage } from "@/lib/utils/image";

interface RelatedStoriesProps {
  articles?: Article[];
}

export const RelatedStories: React.FC<RelatedStoriesProps> = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-6 border-t-2 border-[#111111] font-mono">
      <h3 className="text-base font-extrabold uppercase text-[#111111] font-syne">RELATED DISPATCHES</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((story) => {
          const dateStr = story.published_date
            ? new Date(story.published_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent";

          const imageUrl = getDistinctArticleImage(story.id, story.title, story.image_url);

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
              className="flex items-center gap-3 p-3 bg-[#F3F2ED] border border-[#111111] hover:bg-white transition-all cursor-pointer group shadow-[2px_2px_0px_0px_#111111]"
            >
              {/* Thumbnail */}
              <div className="w-20 h-16 border border-[#111111] bg-[#EBEAE5] overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                <img
                  src={imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="text-[10px] font-bold text-[#555555] uppercase">
                  <span>{story.source?.name || "News"}</span>
                  <span className="mx-1">✦</span>
                  <span>SIMILAR</span>
                </div>
                <h4 className="text-xs font-extrabold text-[#111111] font-syne uppercase leading-snug line-clamp-2 group-hover:underline">
                  {story.title}
                </h4>
                <div className="text-[10px] text-[#555555] font-bold uppercase">
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
