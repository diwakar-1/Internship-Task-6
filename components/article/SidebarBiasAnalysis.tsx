"use client";

import React, { useState } from "react";
import { Info, X, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

interface SidebarBiasAnalysisProps {
  biasLabel?: string;
  leftPercentage?: number;
  centerPercentage?: number;
  rightPercentage?: number;
  confidence?: number;
}

export const SidebarBiasAnalysis: React.FC<SidebarBiasAnalysisProps> = ({
  biasLabel = "Center",
  leftPercentage = 33,
  centerPercentage = 34,
  rightPercentage = 33,
  confidence,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<"left" | "center" | "right" | null>(null);

  const formattedLabel = biasLabel.charAt(0).toUpperCase() + biasLabel.slice(1);
  const leadingPercentage = Math.max(leftPercentage, centerPercentage, rightPercentage);

  return (
    <>
      <div className="bg-white dark:bg-[#1E293B] rounded-[12px] p-5 border border-[#E5E7EB] dark:border-[#334155] shadow-ds-sm space-y-4 font-poppins relative">
        {/* Header with working info icon */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0] dark:border-[#334155]">
          <h3 className="text-base font-bold text-[#0D0D0F] dark:text-slate-100">AI-Estimated Framing</h3>
          <button
            onClick={() => setShowModal(true)}
            aria-label="Bias info"
            title="Click to learn what Left, Center, and Right mean"
            className="text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0D0D0F] dark:hover:text-[#F8FAFC] p-1.5 rounded-full hover:bg-[#F6F6F6] dark:hover:bg-[#334155] transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Overall Bias Headline */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]">Framing Classification</span>
          <h4 className="text-2xl font-bold text-[#1D4ED8] dark:text-blue-400">{formattedLabel} {leadingPercentage}%</h4>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium">
            {confidence !== undefined ? `Confidence: ${Math.round(confidence * 100)}%` : "AI Analysis"}
          </p>
        </div>

        {/* 3 Progress Bars with Hover & Click Explanations */}
        <div className="space-y-2.5 pt-1 text-xs relative">
          {/* Left Bar */}
          <div
            className="flex items-center gap-3 relative cursor-pointer py-1 group"
            onMouseEnter={() => setActiveTooltip("left")}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => setShowModal(true)}
          >
            <span className="w-12 font-medium text-[#0D0D0F] dark:text-slate-100 underline decoration-dotted decoration-[#B42318] group-hover:text-[#B42318]">
              Left
            </span>
            <span className="w-10 font-bold text-[#B42318] text-right">{leftPercentage}%</span>
            <div className="flex-1 h-3 bg-[#F6F6F6] dark:bg-[#0F172A] rounded-full overflow-hidden border border-[#E5E7EB] dark:border-[#334155]">
              <div className="h-full bg-[#B42318] rounded-full" style={{ width: `${leftPercentage}%` }} />
            </div>

            {/* Left Hover Tooltip */}
            {activeTooltip === "left" && (
              <div className="absolute left-0 -top-12 z-20 bg-[#0D0D0F] text-white text-[11px] px-3 py-1.5 rounded-md shadow-lg max-w-xs font-normal animate-in fade-in duration-150">
                <strong className="text-[#F87171]">Left:</strong> Social equity, public regulation, and reform arguments.
              </div>
            )}
          </div>

          {/* Center Bar */}
          <div
            className="flex items-center gap-3 relative cursor-pointer py-1 group"
            onMouseEnter={() => setActiveTooltip("center")}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => setShowModal(true)}
          >
            <span className="w-12 font-medium text-[#0D0D0F] dark:text-slate-100 underline decoration-dotted decoration-[#6B7280] group-hover:text-gray-600">
              Center
            </span>
            <span className="w-10 font-bold text-[#6B7280] text-right">{centerPercentage}%</span>
            <div className="flex-1 h-3 bg-[#F6F6F6] dark:bg-[#0F172A] rounded-full overflow-hidden border border-[#E5E7EB] dark:border-[#334155]">
              <div className="h-full bg-[#9CA3AF] rounded-full" style={{ width: `${centerPercentage}%` }} />
            </div>

            {/* Center Hover Tooltip */}
            {activeTooltip === "center" && (
              <div className="absolute left-0 -top-12 z-20 bg-[#0D0D0F] text-white text-[11px] px-3 py-1.5 rounded-md shadow-lg max-w-xs font-normal animate-in fade-in duration-150">
                <strong className="text-gray-300">Center:</strong> Factual, non-partisan reporting with balanced perspective.
              </div>
            )}
          </div>

          {/* Right Bar */}
          <div
            className="flex items-center gap-3 relative cursor-pointer py-1 group"
            onMouseEnter={() => setActiveTooltip("right")}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => setShowModal(true)}
          >
            <span className="w-12 font-medium text-[#0D0D0F] dark:text-slate-100 underline decoration-dotted decoration-[#1D4ED8] group-hover:text-[#1D4ED8]">
              Right
            </span>
            <span className="w-10 font-bold text-[#1D4ED8] text-right">{rightPercentage}%</span>
            <div className="flex-1 h-3 bg-[#F6F6F6] dark:bg-[#0F172A] rounded-full overflow-hidden border border-[#E5E7EB] dark:border-[#334155]">
              <div className="h-full bg-[#1D4ED8] rounded-full" style={{ width: `${rightPercentage}%` }} />
            </div>

            {/* Right Hover Tooltip */}
            {activeTooltip === "right" && (
              <div className="absolute left-0 -top-12 z-20 bg-[#0D0D0F] text-white text-[11px] px-3 py-1.5 rounded-md shadow-lg max-w-xs font-normal animate-in fade-in duration-150">
                <strong className="text-[#60A5FA]">Right:</strong> Free markets, individual liberty, and traditional values.
              </div>
            )}
          </div>
        </div>

        {/* Explanatory Text */}
        <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed pt-1">
          Political framing is estimated by AI based on article text evidence only and represents analysis, not objective fact.
        </p>

        {/* How We Analyze Bias Button */}
        <Button
          variant="secondary"
          stateVariant="outline"
          onClick={() => setShowModal(true)}
          className="w-full text-xs font-semibold py-2 border-[#E5E7EB] dark:border-[#334155] hover:border-[#0D0D0F] dark:hover:border-[#F8FAFC] cursor-pointer text-[#0D0D0F] dark:text-slate-100 bg-white dark:bg-[#1E293B]"
        >
          How We Analyze Bias
        </Button>
      </div>

      {/* Interactive Explanation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-poppins">
          <div className="bg-white dark:bg-[#1E293B] rounded-[16px] max-w-lg w-full p-6 shadow-2xl space-y-6 relative border border-[#E5E7EB] dark:border-[#334155]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#334155] pb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1D4ED8] dark:text-blue-400" />
                <h3 className="text-lg font-bold text-[#0D0D0F] dark:text-slate-100">Understanding Political Framing</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-[#F6F6F6] dark:hover:bg-[#334155] text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0D0D0F] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Definitions Body */}
            <div className="space-y-4 text-xs text-[#0D0D0F] dark:text-slate-100">
              {/* Left Definition */}
              <div className="p-3.5 bg-red-50/60 dark:bg-red-950/20 rounded-[10px] border border-red-100 dark:border-red-900/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#B42318] text-sm">Left (Progressive / Liberal)</span>
                  <span className="text-[11px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Left Spectrum</span>
                </div>
                <p className="text-[#4B5563] dark:text-[#E2E8F0] leading-relaxed">
                  Emphasizes social equity, government oversight, public investment, civil rights, environmental protection, and systemic reform arguments.
                </p>
              </div>

              {/* Center Definition */}
              <div className="p-3.5 bg-gray-50 dark:bg-[#0F172A] rounded-[10px] border border-gray-200 dark:border-[#334155] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#374151] text-sm">Center (Neutral / Factual)</span>
                  <span className="text-[11px] font-semibold text-gray-700 bg-gray-200 px-2 py-0.5 rounded-full">Non-Partisan</span>
                </div>
                <p className="text-[#4B5563] dark:text-[#E2E8F0] leading-relaxed">
                  Focuses on objective reporting, balanced multi-perspective citations, statistical facts, and direct institutional statements without political slant.
                </p>
              </div>

              {/* Right Definition */}
              <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 rounded-[10px] border border-blue-100 dark:border-blue-900/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1D4ED8] text-sm">Right (Conservative / Traditional)</span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Right Spectrum</span>
                </div>
                <p className="text-[#4B5563] dark:text-[#E2E8F0] leading-relaxed">
                  Emphasizes free-market principles, individual liberty, traditional social structures, fiscal restraint, national defense, and deregulation.
                </p>
              </div>

              {/* AI Methodology Note */}
              <div className="pt-2 text-[11px] text-[#6B7280] dark:text-[#94A3B8] space-y-1 border-t border-[#F0F0F0] dark:border-[#334155]">
                <div className="flex items-center gap-1.5 font-semibold text-[#0D0D0F] dark:text-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>How Our AI Calculates Scores</span>
                </div>
                <p className="leading-relaxed">
                  Our AI evaluates framing keywords, loaded terms, quote distributions, and underlying narrative perspectives extracted directly from the raw article text.
                </p>
              </div>
            </div>

            {/* Modal Footer Close Action */}
            <div className="pt-2 flex justify-end border-t border-[#E5E7EB] dark:border-[#334155]">
              <Button
                variant="primary"
                stateVariant="default"
                onClick={() => setShowModal(false)}
                className="text-xs px-5 py-2 cursor-pointer"
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
