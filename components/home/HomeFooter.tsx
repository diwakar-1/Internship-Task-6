import React from "react";
import { Logo } from "../ui/Logo";

export const HomeFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#EBEAE5] text-[#111111] font-mono py-8 border-t-2 border-[#111111] mt-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <Logo size="md" showTagline={true} />
      </div>
    </footer>
  );
};
