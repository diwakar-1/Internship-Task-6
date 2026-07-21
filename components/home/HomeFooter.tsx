import React from "react";
import { Logo } from "../ui/Logo";

export const HomeFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D0D0F] text-white font-poppins pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-10">
        {/* Top 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Brand & Tagline (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <Logo variant="light" size="sm" showTagline={true} />
          </div>

          {/* Column 2: Company (2.5 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Help (2.5 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              Help
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Connect (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex items-center gap-3 text-gray-300">
              {/* X / Twitter icon */}
              <a href="#" className="hover:text-white transition-colors font-bold text-sm">𝕏</a>
              {/* LinkedIn */}
              <a href="#" className="hover:text-white transition-colors font-bold text-xs">in</a>
              {/* Threads */}
              <a href="#" className="hover:text-white transition-colors font-bold text-xs">@</a>
              {/* YouTube */}
              <a href="#" className="hover:text-white transition-colors font-bold text-xs">▶</a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Line */}
        <div className="pt-6 border-t border-gray-800 text-[11px] text-gray-500 font-normal">
          © 2026 Update You News. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
