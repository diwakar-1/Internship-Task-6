"use client";

import React, { useEffect } from "react";
import posthog from "posthog-js";
import { Info, AlertCircle } from "lucide-react";

interface SidebarAiSummaryProps {
  summary?: string;
  disclaimer?: string | null;
  model?: string;
  articleId?: string;
}

export const SidebarAiSummary: React.FC<SidebarAiSummaryProps> = ({
  summary,
  disclaimer = "AI summaries can make mistakes.",
  model = "gpt-4o-mini",
  articleId,
}) => {
  useEffect(() => {
    if (!summary) {
      console.warn(`[SidebarAiSummary] AI summary is missing or pending for article ${articleId || "unknown"}`);
    }
  }, [summary, articleId]);

  return (
    <div className="bg-[#F3F2ED] border-2 border-[#111111] p-5 space-y-4 font-mono shadow-[4px_4px_0px_0px_#111111]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#111111]">
        <h3 className="text-sm font-extrabold uppercase text-[#111111] font-syne">AI Summary</h3>
        <button aria-label="AI info" className="text-[#111111] p-1 border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors">
          <Info className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Model info */}
      <div className="text-[11px] font-bold text-[#555555] uppercase flex items-center justify-between">
        <span>MODEL: {model}</span>
        {summary ? (
          <span className="text-[10px] text-[#111111] bg-white px-2 py-0.5 border border-[#111111]">
            VERIFIED AI OUTPUT
          </span>
        ) : (
          <span className="text-[10px] text-[#111111] bg-amber-100 px-2 py-0.5 border border-[#111111]">
            PENDING ANALYSIS
          </span>
        )}
      </div>

      {/* Summary Content */}
      <div className="text-xs text-[#111111] leading-relaxed space-y-2 font-sans font-medium">
        {summary ? (
          <p className="whitespace-pre-line leading-relaxed">{summary}</p>
        ) : (
          <div className="flex items-start gap-2 bg-white p-3 border border-[#111111] text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#111111]" />
            <div>
              <p className="font-bold uppercase text-[#111111]">SUMMARY PENDING</p>
              <p className="text-[11px] text-[#555555] mt-0.5 leading-normal">
                This article is pending automated AI analysis. Trigger scrape to update.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-[#555555] italic">
        {disclaimer || "AI summaries can make mistakes."}
      </p>

      {/* Feedback Button */}
      <button
        onClick={() =>
          posthog.capture("ai_summary_feedback_requested", {
            model,
            summary_available: Boolean(summary),
            article_id: articleId,
          })
        }
        className="w-full text-xs font-bold uppercase py-2 bg-white text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
      >
        PROVIDE FEEDBACK ✦
      </button>
    </div>
  );
};
