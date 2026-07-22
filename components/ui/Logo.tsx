import React from "react";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showTagline = false,
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center gap-2 select-none">
      {/* Split Crescent Editorial Logo Icon */}
      <div className={`relative ${iconSizes[size]} rounded-full border-2 border-[#111111] overflow-hidden flex-shrink-0 bg-white`}>
        <div className="absolute inset-0 w-1/2 bg-[#111111]" />
        <div className="absolute inset-0 w-1/2 left-1/2 bg-white" />
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tighter ${sizeClasses[size]} text-[#111111] uppercase font-syne`}>
          UPDATE YOU
        </span>
        {showTagline && (
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#555555] uppercase mt-0.5">
            BALANCED NEWS ✦ AI INSIGHTS
          </span>
        )}
      </div>
    </div>
  );
};
