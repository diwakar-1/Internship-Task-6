import React from "react";
import { Info, ExternalLink } from "lucide-react";

interface SidebarSourceBreakdownProps {
  sourceName?: string;
  sourceUrl?: string;
}

export const SidebarSourceBreakdown: React.FC<SidebarSourceBreakdownProps> = ({
  sourceName = "Primary Source",
  sourceUrl,
}) => {
  return (
    <div className="bg-[#F3F2ED] border-2 border-[#111111] p-5 space-y-4 font-mono shadow-[4px_4px_0px_0px_#111111]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#111111]">
        <h3 className="text-sm font-extrabold uppercase text-[#111111] font-syne">Source Breakdown</h3>
        <button aria-label="Source info" className="text-[#111111] p-1 border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors">
          <Info className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Total Count */}
      <div className="text-xs font-bold text-[#111111] uppercase">
        ORIGINAL REPORTING PUBLICATION
      </div>

      {/* Source detail */}
      <div className="bg-white p-3 border border-[#111111] flex items-center justify-between">
        <div>
          <h4 className="text-xs font-extrabold text-[#111111] uppercase">{sourceName}</h4>
          <span className="text-[10px] font-bold text-[#555555] uppercase">VERIFIED ACTIVE SOURCE</span>
        </div>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 border border-[#111111] bg-[#EBEAE5] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* View Source Button */}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <button className="w-full text-xs font-bold uppercase py-2 bg-white text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer">
            VISIT ORIGINAL SOURCE ✦
          </button>
        </a>
      )}
    </div>
  );
};
