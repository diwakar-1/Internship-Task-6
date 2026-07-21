import React from "react";
import { Info, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";

interface SidebarSourceBreakdownProps {
  sourceName?: string;
  sourceUrl?: string;
}

export const SidebarSourceBreakdown: React.FC<SidebarSourceBreakdownProps> = ({
  sourceName = "Primary Source",
  sourceUrl,
}) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[12px] p-5 border border-[#E5E7EB] dark:border-[#334155] shadow-ds-sm space-y-4 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0] dark:border-[#334155]">
        <h3 className="text-base font-bold text-[#0D0D0F] dark:text-slate-100">Source Breakdown</h3>
        <button aria-label="Source info" className="text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0D0D0F] dark:hover:text-[#F8FAFC] p-1 rounded-full hover:bg-[#F6F6F6] dark:hover:bg-[#334155]">
          <Info className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Total Count */}
      <div className="text-xs font-bold text-[#0D0D0F] dark:text-slate-100">
        Original Reporting Publication
      </div>

      {/* Source detail */}
      <div className="bg-[#F0F0F0]/60 dark:bg-[#0F172A]/40 p-3 rounded-[8px] border border-[#E5E7EB] dark:border-[#334155] flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-[#0D0D0F] dark:text-slate-100">{sourceName}</h4>
          <span className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">Verified Active Source</span>
        </div>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-white dark:bg-[#1E293B] rounded-md border border-[#E5E7EB] dark:border-[#334155] text-[#0D0D0F] dark:text-slate-100 hover:bg-[#F6F6F6] dark:hover:bg-[#334155] transition-colors"
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
          <Button
            variant="secondary"
            stateVariant="outline"
            className="w-full text-xs font-semibold py-2 border-[#E5E7EB] dark:border-[#334155] hover:border-[#0D0D0F] dark:hover:border-[#F8FAFC] bg-white dark:bg-[#1E293B] text-[#0D0D0F] dark:text-slate-100"
          >
            Visit Original Source
          </Button>
        </a>
      )}
    </div>
  );
};
