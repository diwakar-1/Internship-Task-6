import React from "react";
import { Logo } from "../ui/Logo";

export const HomeFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#EBEAE5] text-[#111111] font-mono pt-10 pb-8 border-t-2 border-[#111111] mt-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center space-y-4">
        <Logo size="md" showTagline={true} />

        <div className="text-[10px] uppercase tracking-[0.2em] text-[#555555] border-y border-[#111111] py-2 px-4 w-full max-w-xl">
          HOME ✦ WORLD ✦ BUSINESS ✦ TRAVEL ✦ TECH ✦ FASHION ✦ LIFESTYLE
        </div>

        <div className="text-[11px] text-[#555555] font-bold uppercase">
          © 2026 UPDATE YOU NEWS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
