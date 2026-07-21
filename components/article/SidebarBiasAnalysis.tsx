import React from "react";
import { Info } from "lucide-react";
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
  const formattedLabel = biasLabel.charAt(0).toUpperCase() + biasLabel.slice(1);
  const leadingPercentage = Math.max(leftPercentage, centerPercentage, rightPercentage);

  return (
    <div className="bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-4 font-poppins">
      {/* Header with info icon */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0]">
        <h3 className="text-base font-bold text-[#0D0D0F]">AI-Estimated Framing</h3>
        <button aria-label="Bias info" className="text-[#6B7280] hover:text-[#0D0D0F] p-1 rounded-full">
          <Info className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Overall Bias Headline */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-[#6B7280]">Framing Classification</span>
        <h4 className="text-2xl font-bold text-[#1D4ED8]">{formattedLabel} {leadingPercentage}%</h4>
        <p className="text-xs text-[#6B7280] font-medium">
          {confidence !== undefined ? `Confidence: ${Math.round(confidence * 100)}%` : "AI Analysis"}
        </p>
      </div>

      {/* 3 Progress Bars */}
      <div className="space-y-2.5 pt-1 text-xs">
        {/* Left Bar */}
        <div className="flex items-center gap-3">
          <span className="w-12 font-medium text-[#0D0D0F]">Left</span>
          <span className="w-10 font-bold text-[#B42318] text-right">{leftPercentage}%</span>
          <div className="flex-1 h-3 bg-[#F6F6F6] rounded-full overflow-hidden border border-[#E5E7EB]">
            <div className="h-full bg-[#B42318] rounded-full" style={{ width: `${leftPercentage}%` }} />
          </div>
        </div>

        {/* Center Bar */}
        <div className="flex items-center gap-3">
          <span className="w-12 font-medium text-[#0D0D0F]">Center</span>
          <span className="w-10 font-bold text-[#6B7280] text-right">{centerPercentage}%</span>
          <div className="flex-1 h-3 bg-[#F6F6F6] rounded-full overflow-hidden border border-[#E5E7EB]">
            <div className="h-full bg-[#9CA3AF] rounded-full" style={{ width: `${centerPercentage}%` }} />
          </div>
        </div>

        {/* Right Bar */}
        <div className="flex items-center gap-3">
          <span className="w-12 font-medium text-[#0D0D0F]">Right</span>
          <span className="w-10 font-bold text-[#1D4ED8] text-right">{rightPercentage}%</span>
          <div className="flex-1 h-3 bg-[#F6F6F6] rounded-full overflow-hidden border border-[#E5E7EB]">
            <div className="h-full bg-[#1D4ED8] rounded-full" style={{ width: `${rightPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Explanatory Text */}
      <p className="text-xs text-[#6B7280] leading-relaxed pt-1">
        Political framing is estimated by AI based on article text evidence only and represents analysis, not objective fact.
      </p>

      {/* How We Analyze Bias Button */}
      <Button
        variant="secondary"
        stateVariant="outline"
        className="w-full text-xs font-semibold py-2 border-[#E5E7EB] hover:border-[#0D0D0F]"
      >
        How We Analyze Bias
      </Button>
    </div>
  );
};
