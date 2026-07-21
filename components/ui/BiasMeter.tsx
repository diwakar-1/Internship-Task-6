import React from "react";

export interface BiasMeterProps {
  left: number;
  center: number;
  right: number;
  showLabels?: boolean;
  showTicks?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BiasMeter: React.FC<BiasMeterProps> = ({
  left = 25,
  center = 50,
  right = 25,
  showLabels = true,
  showTicks = false,
  size = "md",
  className = "",
}) => {
  // Normalize if total doesn't equal 100
  const total = left + center + right;
  const leftPct = total > 0 ? Math.round((left / total) * 100) : 33;
  const rightPct = total > 0 ? Math.round((right / total) * 100) : 33;
  const centerPct = 100 - leftPct - rightPct;

  const heightClasses = {
    sm: "h-6 text-[10px]",
    md: "h-8 text-xs",
    lg: "h-10 text-sm",
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {/* 3-segment bar */}
      <div className={`w-full ${heightClasses[size]} rounded-[4px] overflow-hidden flex font-poppins font-medium select-none shadow-inner`}>
        {/* Left Segment */}
        {leftPct > 0 && (
          <div
            style={{ width: `${leftPct}%` }}
            className="bg-[#B42318] text-white flex items-center justify-center transition-all duration-300 px-1 overflow-hidden whitespace-nowrap text-ellipsis cursor-help"
            title={`Left (${leftPct}%): Progressive/Liberal framing focusing on social equity & regulation`}
          >
            {showLabels && (leftPct >= 12 ? `Left ${leftPct}%` : `${leftPct}%`)}
          </div>
        )}

        {/* Center Segment */}
        {centerPct > 0 && (
          <div
            style={{ width: `${centerPct}%` }}
            className="bg-[#E5E7EB] text-[#0D0D0F] flex items-center justify-center transition-all duration-300 px-1 overflow-hidden whitespace-nowrap text-ellipsis border-x border-white/40 cursor-help"
            title={`Center (${centerPct}%): Factual/Neutral non-partisan reporting`}
          >
            {showLabels && (centerPct >= 12 ? `Center ${centerPct}%` : `${centerPct}%`)}
          </div>
        )}

        {/* Right Segment */}
        {rightPct > 0 && (
          <div
            style={{ width: `${rightPct}%` }}
            className="bg-[#1D4ED8] text-white flex items-center justify-center transition-all duration-300 px-1 overflow-hidden whitespace-nowrap text-ellipsis cursor-help"
            title={`Right (${rightPct}%): Conservative/Traditional framing focusing on free markets & individual liberty`}
          >
            {showLabels && (rightPct >= 12 ? `Right ${rightPct}%` : `${rightPct}%`)}
          </div>
        )}
      </div>

      {/* Optional 0%, 50%, 100% ticks */}
      {showTicks && (
        <div className="flex justify-between text-[11px] text-[#6B7280] font-poppins px-0.5">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};
