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
          ? "bg-[#0D0D0F] text-white border-[#0D0D0F] shadow-ds-sm"
          : "bg-[#E5E7EB] text-[#0D0D0F] border-transparent hover:bg-[#D1D5DB] active:scale-95"
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
