"use client";

import React, { useState } from "react";
import { Info, X, HelpCircle, CheckCircle2 } from "lucide-react";

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

  const formattedLabel = biasLabel.charAt(0).toUpperCase() + biasLabel.slice(1);
  const leadingPercentage = Math.max(leftPercentage, centerPercentage, rightPercentage);

  return (
    <>
      <div className="bg-[#F3F2ED] border-2 border-[#111111] p-5 space-y-4 font-mono shadow-[4px_4px_0px_0px_#111111]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#111111]">
          <h3 className="text-sm font-extrabold uppercase text-[#111111] font-syne">AI-Estimated Framing</h3>
          <button
            onClick={() => setShowModal(true)}
            aria-label="Bias info"
            title="Click to learn what Left, Center, and Right mean"
            className="text-[#111111] hover:bg-[#111111] hover:text-white p-1 border border-[#111111] transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Overall Bias Headline */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#555555]">Framing Classification</span>
          <h4 className="text-xl font-extrabold text-[#111111] font-syne uppercase">{formattedLabel} {leadingPercentage}%</h4>
          <p className="text-[11px] text-[#555555] font-bold uppercase">
            {confidence !== undefined ? `Confidence: ${Math.round(confidence * 100)}%` : "AI Analysis"}
          </p>
        </div>

        {/* 3 Progress Bars */}
        <div className="space-y-3 pt-1 text-xs">
          {/* Left Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold uppercase text-[#111111]">
              <span>Left</span>
              <span className="text-[#B42318]">{leftPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-white border border-[#111111] overflow-hidden">
              <div className="h-full bg-[#B42318]" style={{ width: `${leftPercentage}%` }} />
            </div>
          </div>

          {/* Center Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold uppercase text-[#111111]">
              <span>Center</span>
              <span className="text-[#555555]">{centerPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-white border border-[#111111] overflow-hidden">
              <div className="h-full bg-[#666666]" style={{ width: `${centerPercentage}%` }} />
            </div>
          </div>

          {/* Right Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold uppercase text-[#111111]">
              <span>Right</span>
              <span className="text-[#1D4ED8]">{rightPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-white border border-[#111111] overflow-hidden">
              <div className="h-full bg-[#1D4ED8]" style={{ width: `${rightPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Explanatory Text */}
        <p className="text-[10px] text-[#555555] leading-relaxed pt-1">
          Political framing is estimated by AI based on article text evidence only and represents analysis, not objective fact.
        </p>

        {/* How We Analyze Bias Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full text-xs font-bold uppercase py-2 bg-white text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
        >
          HOW WE ANALYZATION BIAS ✦
        </button>
      </div>

      {/* Interactive Explanation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-mono">
          <div className="bg-[#EBEAE5] border-2 border-[#111111] max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-[#111111] pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#111111]" />
                <h3 className="text-base font-extrabold uppercase font-syne text-[#111111]">UNDERSTANDING POLITICAL FRAMING</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-[#111111] hover:text-white transition-colors border border-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#111111]">
              <div className="p-3 bg-white border border-[#111111] space-y-1">
                <span className="font-bold text-[#B42318] block uppercase">LEFT SPECTRUM</span>
                <p className="text-[#333333] leading-relaxed">
                  Emphasizes social equity, government oversight, public investment, civil rights, and systemic reform arguments.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#111111] space-y-1">
                <span className="font-bold text-[#555555] block uppercase">CENTER (NEUTRAL)</span>
                <p className="text-[#333333] leading-relaxed">
                  Focuses on objective reporting, balanced multi-perspective citations, statistical facts, and direct statements without political slant.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#111111] space-y-1">
                <span className="font-bold text-[#1D4ED8] block uppercase">RIGHT SPECTRUM</span>
                <p className="text-[#333333] leading-relaxed">
                  Emphasizes free-market principles, individual liberty, traditional social structures, fiscal restraint, and deregulation.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-[#111111]">
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#111111] text-white text-xs uppercase font-bold px-5 py-2 hover:bg-white hover:text-[#111111] border border-[#111111] transition-all cursor-pointer"
              >
                GOT IT ✦
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
