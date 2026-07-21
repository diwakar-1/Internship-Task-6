"use client";

import React from "react";
import posthog from "posthog-js";
import { Info } from "lucide-react";
import { Button } from "../ui/Button";

interface SidebarAiSummaryProps {
  summary?: string;
  disclaimer?: string | null;
  model?: string;
}

export const SidebarAiSummary: React.FC<SidebarAiSummaryProps> = ({
  summary,
  disclaimer = "AI summaries can make mistakes.",
  model = "gpt-4o-mini",
}) => {
  return (
    <div className="bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-4 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0]">
        <h3 className="text-base font-bold text-[#0D0D0F]">AI Summary</h3>
        <button aria-label="AI info" className="text-[#6B7280] hover:text-[#0D0D0F] p-1 rounded-full">
          <Info className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Model info */}
      <div className="text-xs text-[#6B7280]">
        Model: {model}
      </div>

      {/* Summary Content */}
      <div className="text-xs text-[#0D0D0F] leading-relaxed space-y-2">
        {summary ? (
          <p>{summary}</p>
        ) : (
          <p className="text-[#6B7280] italic">
            This article is pending AI analysis.
          </p>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-[#6B7280] italic">
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
          })
        }
        className="w-full text-xs font-semibold py-2 border-[#E5E7EB] hover:border-[#0D0D0F]"
      >
        Provide Feedback
      </Button>
    </div>
  );
};
