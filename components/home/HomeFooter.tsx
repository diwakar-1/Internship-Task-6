import React from "react";
import { Logo } from "../ui/Logo";

export const HomeFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D0D0F] text-white font-poppins pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center space-y-6">
        {/* Centered Brand Logo & Tagline */}
        <Logo variant="light" size="md" showTagline={true} />

        {/* Bottom Copyright Line */}
        <div className="pt-4 text-[11px] text-gray-500 font-normal">
          © 2026 Update You News. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
