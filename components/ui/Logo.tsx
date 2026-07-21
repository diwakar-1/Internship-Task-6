import React from "react";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "dark",
  size = "md",
  showTagline = false,
}) => {
  const textColor = variant === "dark" ? "text-[#0D0D0F] dark:text-[#F8FAFC]" : "text-white";
  const subtitleColor = variant === "dark" ? "text-[#6B7280] dark:text-[#94A3B8]" : "text-gray-400";
  const taglineColor = variant === "dark" ? "text-[#6B7280] dark:text-[#94A3B8]" : "text-gray-300";

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-[38px]",
    lg: "text-5xl",
  };

  return (
    <div className="flex flex-col items-center text-center select-none">
      <div className="flex flex-col items-center leading-none tracking-tight">
        <span className={`font-black tracking-tighter ${sizeClasses[size]} ${textColor} lowercase font-poppins`}>
          update you
        </span>
        <span className={`font-bold text-xs uppercase tracking-[0.22em] ${subtitleColor} mt-0.5`}>
          News
        </span>
      </div>
      {showTagline && (
        <p className={`text-[13px] ${taglineColor} mt-3 max-w-[200px] leading-snug font-normal font-poppins`}>
          Balanced news coverage,<br />powered by AI.
        </p>
      )}
    </div>
  );
};
