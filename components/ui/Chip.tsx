import React from "react";
import { Plus, Check } from "lucide-react";

export interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  showIcon?: boolean;
  iconType?: "plus" | "check";
  size?: "sm" | "md";
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onClick,
  showIcon = true,
  iconType = "plus",
  size = "md",
}) => {
  const sizeClasses = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-xs font-medium";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full font-poppins transition-all duration-150 border select-none ${
        active
          ? "bg-[#0D0D0F] dark:bg-blue-600 text-white border-[#0D0D0F] dark:border-blue-600 shadow-ds-sm"
          : "bg-[#E5E7EB] dark:bg-[#1E293B] text-[#0D0D0F] dark:text-[#F8FAFC] border-transparent dark:border-[#334155] hover:bg-[#D1D5DB] dark:hover:bg-[#334155] active:scale-95"
      } ${sizeClasses}`}
    >
      <span>{label}</span>
      {showIcon && (
        iconType === "check" || active ? (
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        ) : (
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        )
      )}
    </button>
  );
};
