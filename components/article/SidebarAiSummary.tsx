"use client";

import React, { useEffect } from "react";
import posthog from "posthog-js";
import { Info, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

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
    <div className="bg-white dark:bg-[#1E293B] rounded-[12px] p-5 border border-[#E5E7EB] dark:border-[#334155] shadow-ds-sm space-y-4 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0] dark:border-[#334155]">
        <h3 className="text-base font-bold text-[#0D0D0F] dark:text-slate-100">AI Summary</h3>
        <button aria-label="AI info" className="text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0D0D0F] dark:hover:text-[#F8FAFC] p-1 rounded-full hover:bg-[#F6F6F6] dark:hover:bg-[#334155]">
          <Info className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Model info */}
      <div className="text-xs text-[#6B7280] dark:text-[#94A3B8] flex items-center justify-between">
        <span>Model: {model}</span>
        {summary ? (
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-semibold border border-emerald-200 dark:border-emerald-800">
            Verified AI Output
          </span>
        ) : (
          <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded font-semibold border border-amber-200 dark:border-amber-800">
            Pending Analysis
          </span>
        )}
      </div>

      {/* Summary Content */}
      <div className="text-xs text-[#0D0D0F] dark:text-slate-100 leading-relaxed space-y-2">
        {summary ? (
          <p className="whitespace-pre-line text-[#1F2937] dark:text-[#E2E8F0] font-normal leading-relaxed">{summary}</p>
        ) : (
          <div className="flex items-start gap-2 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-[8px] border border-amber-200 dark:border-amber-900/50 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">Summary Not Yet Available</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 leading-normal">
                This article is currently pending automated AI analysis. Check back shortly.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] italic">
        {disclaimer || "AI summaries can make mistakes."}
      </p>

      {/* Feedback Button */}
      <Button
        variant="secondary"
        stateVariant="outline"
        onClick={() =>
          posthog.capture("ai_summary_feedback_requested", {
            model,
            summary_available: Boolean(summary),
            article_id: articleId,
          })
        }
        className="w-full text-xs font-semibold py-2 border-[#E5E7EB] dark:border-[#334155] hover:border-[#0D0D0F] dark:hover:border-[#F8FAFC] bg-white dark:bg-[#1E293B] text-[#0D0D0F] dark:text-slate-100"
      >
        Provide Feedback
      </Button>
    </div>
  );
};
