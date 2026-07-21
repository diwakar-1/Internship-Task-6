"use client";

import React, { useState } from "react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { BiasMeter } from "../ui/BiasMeter";
import { ArticleCard } from "../ui/ArticleCard";
import {
  Menu,
  Search,
  Bookmark,
  Clock,
  Info,
  Share2,
  ExternalLink,
  Calendar,
  TrendingUp,
  Tag,
  User,
  Bell,
  SlidersHorizontal,
  Check,
  MoreHorizontal,
  CheckCheck,
  Grid,
} from "lucide-react";

export const DesignSystemBoard: React.FC = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [activeChip, setActiveChip] = useState<string>("World Cup");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#EAEAEA] p-3 sm:p-6 font-poppins text-[#0D0D0F]">
      {/* Optional Grid Overlay */}
      {showGridOverlay && (
        <div className="fixed inset-0 pointer-events-none z-50 max-w-[1280px] mx-auto px-6 grid grid-cols-12 gap-6 opacity-15">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-indigo-600 h-full w-full" />
          ))}
        </div>
      )}

      {/* Main Container mirroring 1280px grid spec */}
      <div className="max-w-[1280px] mx-auto space-y-4">
        
        {/* Top Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-[12px] shadow-ds-sm border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl tracking-tight">Update Me</span>
            <span className="bg-[#0D0D0F] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Design System v1.0
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGridOverlay(!showGridOverlay)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-[8px] transition-colors border ${
                showGridOverlay
                  ? "bg-[#0D0D0F] text-white border-[#0D0D0F]"
                  : "bg-white text-[#0D0D0F] border-[#E5E7EB] hover:bg-[#F6F6F6]"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{showGridOverlay ? "Hide Grid Overlay" : "Show 12-Col Grid Overlay"}</span>
            </button>
          </div>
        </div>

        {/* Board Canvas */}
        <div className="bg-[#F0F0F0] p-4 sm:p-6 rounded-[16px] border border-[#E5E7EB] shadow-ds-md space-y-4">
          
          {/* TOP ROW: BRAND (Left) & TYPOGRAPHY (Center) & UI ELEMENTS (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* COLUMN 1 (4 cols): BRAND & COLORS */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* CARD: BRAND */}
              <div className="bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm flex flex-col justify-between min-h-[220px]">
                <div className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase pb-3 border-b border-[#F0F0F0]">
                  BRAND
                </div>
                <div className="py-6 flex flex-col items-center justify-center">
                  <Logo size="md" showTagline={true} />
                </div>
              </div>

              {/* CARD: COLORS */}
              <div className="bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-4">
                <div className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0]">
                  COLORS
                </div>

                {/* Primary Colors */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                    PRIMARY
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Swatch 1 */}
                    <div
                      onClick={() => copyToClipboard("#0D0D0F")}
                      className="group cursor-pointer text-center"
                    >
                      <div className="h-16 rounded-[8px] bg-[#0D0D0F] mb-1.5 border border-black/10 group-hover:scale-[1.02] transition-transform relative flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm transition-opacity">
                          Copy
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#0D0D0F] uppercase">TEXT PRIMARY</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">#0D0D0F</p>
                    </div>

                    {/* Swatch 2 */}
                    <div
                      onClick={() => copyToClipboard("#6B7280")}
                      className="group cursor-pointer text-center"
                    >
                      <div className="h-16 rounded-[8px] bg-[#6B7280] mb-1.5 border border-black/10 group-hover:scale-[1.02] transition-transform relative flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm transition-opacity">
                          Copy
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#0D0D0F] uppercase">TEXT SECONDARY</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">#6B7280</p>
                    </div>

                    {/* Swatch 3 */}
                    <div
                      onClick={() => copyToClipboard("#F6F6F6")}
                      className="group cursor-pointer text-center"
                    >
                      <div className="h-16 rounded-[8px] bg-[#F6F6F6] mb-1.5 border border-[#E5E7EB] group-hover:scale-[1.02] transition-transform relative flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-[#0D0D0F] text-[10px] bg-white/80 px-1.5 py-0.5 rounded backdrop-blur-sm transition-opacity">
                          Copy
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#0D0D0F] uppercase">SURFACE</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">#F6F6F6</p>
                    </div>
                  </div>
                </div>

                {/* Semantic Colors */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                    SEMANTIC
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Left Bias */}
                    <div
                      onClick={() => copyToClipboard("#B42318")}
                      className="group cursor-pointer text-center"
                    >
                      <div className="h-16 rounded-[8px] bg-[#B42318] mb-1.5 border border-black/10 group-hover:scale-[1.02] transition-transform relative flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm transition-opacity">
                          Copy
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#0D0D0F] uppercase">LEFT BIAS</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">#B42318</p>
                    </div>

                    {/* Center */}
                    <div
                      onClick={() => copyToClipboard("#E5E7EB")}
                      className="group cursor-pointer text-center"
                    >
                      <div className="h-16 rounded-[8px] bg-[#E5E7EB] mb-1.5 border border-[#D1D5DB] group-hover:scale-[1.02] transition-transform relative flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-[#0D0D0F] text-[10px] bg-white/80 px-1.5 py-0.5 rounded backdrop-blur-sm transition-opacity">
                          Copy
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#0D0D0F] uppercase">CENTER</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">#E5E7EB</p>
                    </div>

                    {/* Right Bias */}
                    <div
                      onClick={() => copyToClipboard("#1D4ED8")}
                      className="group cursor-pointer text-center"
                    >
                      <div className="h-16 rounded-[8px] bg-[#1D4ED8] mb-1.5 border border-black/10 group-hover:scale-[1.02] transition-transform relative flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm transition-opacity">
                          Copy
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#0D0D0F] uppercase">RIGHT BIAS</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">#1D4ED8</p>
                    </div>
                  </div>
                </div>

                {/* Neutrals Colors */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                    NEUTRALS
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div onClick={() => copyToClipboard("#FFFFFF")} className="cursor-pointer text-center">
                      <div className="h-12 rounded-[6px] bg-white border border-[#E5E7EB] mb-1" />
                      <p className="text-[9px] font-semibold uppercase">BG PRIMARY</p>
                      <p className="text-[9px] text-[#6B7280] font-mono">#FFFFFF</p>
                    </div>
                    <div onClick={() => copyToClipboard("#F0F0F0")} className="cursor-pointer text-center">
                      <div className="h-12 rounded-[6px] bg-[#F0F0F0] border border-[#E5E7EB] mb-1" />
                      <p className="text-[9px] font-semibold uppercase">BG SECONDARY</p>
                      <p className="text-[9px] text-[#6B7280] font-mono">#F0F0F0</p>
                    </div>
                    <div onClick={() => copyToClipboard("#E5E7EB")} className="cursor-pointer text-center">
                      <div className="h-12 rounded-[6px] bg-[#E5E7EB] border border-[#D1D5DB] mb-1" />
                      <p className="text-[9px] font-semibold uppercase">BORDER</p>
                      <p className="text-[9px] text-[#6B7280] font-mono">#E5E7EB</p>
                    </div>
                    <div onClick={() => copyToClipboard("#E5E7EB")} className="cursor-pointer text-center">
                      <div className="h-12 rounded-[6px] bg-[#E5E7EB] border border-[#D1D5DB] mb-1" />
                      <p className="text-[9px] font-semibold uppercase">DIVIDER</p>
                      <p className="text-[9px] text-[#6B7280] font-mono">#E5E7EB</p>
                    </div>
                  </div>
                </div>

                {copiedToken && (
                  <div className="text-[11px] text-emerald-600 font-semibold text-center flex items-center justify-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Copied {copiedToken} to clipboard</span>
                  </div>
                )}
              </div>

            </div>

            {/* COLUMN 2 (4 cols): TYPOGRAPHY */}
            <div className="lg:col-span-4 bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-4">
              <div className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0]">
                TYPOGRAPHY
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                  FONT FAMILY
                </span>
                <h3 className="text-3xl font-extrabold text-[#0D0D0F] font-poppins mt-0.5">
                  Poppins
                </h3>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Poppins is a modern geometric sans-serif typeface that ensures clarity and excellent readability.
                </p>
              </div>

              {/* Typography Spec Table */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-12 text-[10px] font-bold text-[#9CA3AF] uppercase border-b border-[#F0F0F0] pb-1.5">
                  <div className="col-span-3">STYLE</div>
                  <div className="col-span-4">EXAMPLE</div>
                  <div className="col-span-2 text-center">SIZE</div>
                  <div className="col-span-2 text-center">WEIGHT</div>
                  <div className="col-span-1 text-right">LH</div>
                </div>

                {/* H1 */}
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-3 font-bold text-sm">H1</div>
                  <div className="col-span-4 font-bold text-lg leading-tight truncate">Page / Screen Title</div>
                  <div className="col-span-2 text-center text-[#6B7280]">32px</div>
                  <div className="col-span-2 text-center text-[#6B7280]">Bold</div>
                  <div className="col-span-1 text-right text-[#6B7280]">1.2</div>
                </div>

                {/* H2 */}
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-3 font-semibold text-sm">H2</div>
                  <div className="col-span-4 font-semibold text-base truncate">Section Title</div>
                  <div className="col-span-2 text-center text-[#6B7280]">24px</div>
                  <div className="col-span-2 text-center text-[#6B7280]">SemiBold</div>
                  <div className="col-span-1 text-right text-[#6B7280]">1.3</div>
                </div>

                {/* H3 */}
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-3 font-semibold text-xs">H3</div>
                  <div className="col-span-4 font-semibold text-sm truncate">Card / Module Title</div>
                  <div className="col-span-2 text-center text-[#6B7280]">20px</div>
                  <div className="col-span-2 text-center text-[#6B7280]">SemiBold</div>
                  <div className="col-span-1 text-right text-[#6B7280]">1.3</div>
                </div>

                {/* H4 */}
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-3 font-medium text-xs">H4</div>
                  <div className="col-span-4 font-medium text-xs truncate">Subheading</div>
                  <div className="col-span-2 text-center text-[#6B7280]">16px</div>
                  <div className="col-span-2 text-center text-[#6B7280]">Medium</div>
                  <div className="col-span-1 text-right text-[#6B7280]">1.4</div>
                </div>

                {/* Body Large */}
                <div className="grid grid-cols-12 items-center pt-1 border-t border-[#F0F0F0]">
                  <div className="col-span-3 text-[11px] text-[#4B5563]">Body Large</div>
                  <div className="col-span-4 text-xs font-normal truncate">Important content</div>
                  <div className="col-span-2 text-center text-[#6B7280]">16px</div>
                  <div className="col-span-2 text-center text-[#6B7280]">Regular</div>
                  <div className="col-span-1 text-right text-[#6B7280]">1.6</div>
                </div>

                {/* Body Medium */}
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-3 text-[11px] text-[#4B5563]">Body Medium</div>
                  <div className="col-span-4 text-xs font-normal truncate">Body text</div>
                  <div className="col-span-2 text-center text-[#6B7280]">14px</div>
                  <div className="col-span-2 text-center text-[#6B7280]">Regular</div>
                  <div className="col-span-1 text-right text-[#6B7280]">1.6</div>
                </div>

                {/* Body Small */}
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-3 text-[11px] text-[#4B5563]">Body Small</div>
                  <div className="col-span-4 text-[11px] font-normal truncate">Supporting text</div>
                  <div className="col-span-2 text-center text-[#6B7280]">13px</div>
                  <div className="col-span-2 text-center text-[#6B7280]">Regular</div>
                  <div className="col-span-1 text-right text-[#6B7280]">1.6</div>
                </div>

                {/* Caption */}
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-3 text-[11px] text-[#4B5563]">Caption</div>
                  <div className="col-span-4 text-[10px] font-normal truncate">Labels, meta text</div>
                  <div className="col-span-2 text-center text-[#6B7280]">11px</div>
                  <div className="col-span-2 text-center text-[#6B7280]">Regular</div>
                  <div className="col-span-1 text-right text-[#6B7280]">1.4</div>
                </div>
              </div>
            </div>

            {/* COLUMN 3 (4 cols): UI ELEMENTS */}
            <div className="lg:col-span-4 bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-5">
              <div className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0]">
                UI ELEMENTS
              </div>

              {/* BUTTONS MATRIX */}
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                  BUTTONS
                </span>
                <div className="space-y-2.5">
                  {/* Header labels */}
                  <div className="grid grid-cols-5 text-[10px] font-semibold text-[#9CA3AF] text-center">
                    <span className="text-left">TYPE</span>
                    <span>Default</span>
                    <span>Hover</span>
                    <span>Outline</span>
                    <span>Disabled</span>
                  </div>

                  {/* Primary Row */}
                  <div className="grid grid-cols-5 items-center text-center gap-1">
                    <span className="text-left text-xs font-semibold">Primary</span>
                    <Button variant="primary" stateVariant="default" className="text-xs px-2 py-1">Button</Button>
                    <Button variant="primary" stateVariant="hover" className="text-xs px-2 py-1">Button</Button>
                    <Button variant="primary" stateVariant="outline" className="text-xs px-2 py-1">Button</Button>
                    <Button variant="primary" stateVariant="disabled" className="text-xs px-2 py-1">Button</Button>
                  </div>

                  {/* Secondary Row */}
                  <div className="grid grid-cols-5 items-center text-center gap-1">
                    <span className="text-left text-xs font-semibold">Secondary</span>
                    <Button variant="secondary" stateVariant="default" className="text-xs px-2 py-1">Button</Button>
                    <Button variant="secondary" stateVariant="hover" className="text-xs px-2 py-1">Button</Button>
                    <Button variant="secondary" stateVariant="outline" className="text-xs px-2 py-1">Button</Button>
                    <Button variant="secondary" stateVariant="disabled" className="text-xs px-2 py-1">Button</Button>
                  </div>

                  {/* Text Row */}
                  <div className="grid grid-cols-5 items-center text-center gap-1">
                    <span className="text-left text-xs font-semibold">Text</span>
                    <Button variant="text" stateVariant="default" className="text-xs px-2 py-1">Button</Button>
                    <Button variant="text" stateVariant="hover" className="text-xs px-2 py-1">Button</Button>
                    <span className="text-[#9CA3AF] text-xs">—</span>
                    <span className="text-[#9CA3AF] text-xs">—</span>
                  </div>
                </div>
              </div>

              {/* CHIP / CATEGORY */}
              <div className="pt-2 border-t border-[#F0F0F0]">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                  CHIP / CATEGORY
                </span>
                <div className="flex flex-wrap gap-2">
                  <Chip
                    label="World Cup"
                    active={activeChip === "World Cup"}
                    onClick={() => setActiveChip("World Cup")}
                  />
                  <Chip
                    label="IPL"
                    active={activeChip === "IPL"}
                    onClick={() => setActiveChip("IPL")}
                  />
                  <Chip
                    label="Business & Markets"
                    active={activeChip === "Business & Markets"}
                    onClick={() => setActiveChip("Business & Markets")}
                  />
                  <Chip
                    label="More"
                    active={activeChip === "More"}
                    onClick={() => setActiveChip("More")}
                  />
                </div>
              </div>

              {/* BIAS METER SPEC */}
              <div className="pt-2 border-t border-[#F0F0F0]">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                  BIAS METER
                </span>
                <BiasMeter left={25} center={50} right={25} showTicks={true} size="md" />
              </div>

            </div>

          </div>

          {/* SECOND ROW: ICONS (Left 6 cols) & CARD EXAMPLE (Right 6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* CARD: ICONS (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0]">
                  ICONS
                </div>

                {/* 15 Line Icons Grid */}
                <div className="grid grid-cols-5 gap-4 py-4 text-[#0D0D0F]">
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Menu">
                    <Menu className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Search">
                    <Search className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Bookmark">
                    <Bookmark className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Clock">
                    <Clock className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Info">
                    <Info className="w-5 h-5 stroke-[2]" />
                  </div>

                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Share">
                    <Share2 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="External Link">
                    <ExternalLink className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Calendar">
                    <Calendar className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Trending">
                    <TrendingUp className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Tag">
                    <Tag className="w-5 h-5 stroke-[2]" />
                  </div>

                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="User">
                    <User className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Bell">
                    <Bell className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Sliders">
                    <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="Check">
                    <Check className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded-[8px] bg-[#F6F6F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer" title="More">
                    <MoreHorizontal className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#6B7280] font-normal pt-2 border-t border-[#F0F0F0]">
                Line style · 2px stroke · Rounded caps
              </div>
            </div>

            {/* CARD: CARD EXAMPLE (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-3">
              <div className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0]">
                CARD EXAMPLE
              </div>

              {/* Exact Card Example matching design spec */}
              <ArticleCard
                category="Politics"
                region="United States"
                title="Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report"
                summary="The proposal includes stricter limits on uranium enrichment and enhanced verification measures."
                imageUrl="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
                leftBias={25}
                centerBias={50}
                rightBias={49}
                timeAgo="2h ago"
                readTime="12 min read"
              />
            </div>

          </div>

          {/* THIRD ROW: SPACING SYSTEM & GRID SYSTEM & SHADOWS & BORDER RADIUS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* SPACING SYSTEM (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0] flex items-center justify-between">
                  <span>SPACING SYSTEM</span>
                  <span className="text-[10px] text-[#9CA3AF] font-normal">(4px BASE UNIT)</span>
                </div>

                {/* Visual Bars for Spacing */}
                <div className="flex items-end justify-between gap-2 h-28 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-4 bg-indigo-200 rounded-sm" style={{ height: "10%" }} />
                    <span className="text-[10px] font-bold text-[#6B7280]">4px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-5 bg-indigo-200 rounded-sm" style={{ height: "20%" }} />
                    <span className="text-[10px] font-bold text-[#6B7280]">8px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 bg-indigo-200 rounded-sm" style={{ height: "35%" }} />
                    <span className="text-[10px] font-bold text-[#6B7280]">16px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-7 bg-indigo-200 rounded-sm" style={{ height: "50%" }} />
                    <span className="text-[10px] font-bold text-[#6B7280]">24px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 bg-indigo-200 rounded-sm" style={{ height: "65%" }} />
                    <span className="text-[10px] font-bold text-[#6B7280]">32px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 bg-indigo-200 rounded-sm" style={{ height: "80%" }} />
                    <span className="text-[10px] font-bold text-[#6B7280]">40px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-11 bg-indigo-200 rounded-sm" style={{ height: "100%" }} />
                    <span className="text-[10px] font-bold text-[#6B7280]">64px</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#6B7280] font-normal pt-2 border-t border-[#F0F0F0]">
                Consistent spacing scale based on 4px base unit
              </p>
            </div>

            {/* GRID SYSTEM (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-ds-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0]">
                  GRID SYSTEM
                </div>

                {/* 12 Columns Visual Preview */}
                <div className="relative h-28 my-3 p-2 bg-[#F6F6F6] rounded-[8px] border border-[#E5E7EB] grid grid-cols-12 gap-1.5 items-center">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-full bg-indigo-100/90 rounded-sm border border-indigo-200" />
                  ))}

                  {/* Floating spec labels */}
                  <div className="absolute right-3 top-2 text-[10px] font-mono text-[#6B7280] text-right space-y-0.5">
                    <div><span className="font-semibold text-[#0D0D0F]">Container</span> 1280px</div>
                    <div><span className="font-semibold text-[#0D0D0F]">Columns</span> 12</div>
                    <div><span className="font-semibold text-[#0D0D0F]">Gutter</span> 24px</div>
                    <div><span className="font-semibold text-[#0D0D0F]">Margin</span> 24px</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#6B7280] font-normal pt-2 border-t border-[#F0F0F0]">
                12-Column Responsive Layout Grid
              </p>
            </div>

            {/* SHADOWS & BORDER RADIUS (4 cols split into 2) */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              
              {/* SHADOWS */}
              <div className="bg-white rounded-[12px] p-4 border border-[#E5E7EB] shadow-ds-sm space-y-3">
                <div className="text-[10px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0]">
                  SHADOWS
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-white border border-gray-100 shadow-ds-sm" />
                    <div>
                      <p className="text-[10px] font-bold">SMALL</p>
                      <p className="text-[9px] text-[#6B7280] font-mono">0px 1px 2px rgba(0,0,0,0.05)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-white border border-gray-100 shadow-ds-md" />
                    <div>
                      <p className="text-[10px] font-bold">MEDIUM</p>
                      <p className="text-[9px] text-[#6B7280] font-mono">0px 4px 12px rgba(0,0,0,0.08)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-white border border-gray-100 shadow-ds-lg" />
                    <div>
                      <p className="text-[10px] font-bold">LARGE</p>
                      <p className="text-[9px] text-[#6B7280] font-mono">0px 12px 24px rgba(0,0,0,0.12)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BORDER RADIUS */}
              <div className="bg-white rounded-[12px] p-4 border border-[#E5E7EB] shadow-ds-sm space-y-3">
                <div className="text-[10px] font-bold tracking-widest text-[#6B7280] uppercase pb-2 border-b border-[#F0F0F0]">
                  BORDER RADIUS
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 bg-[#F6F6F6] border border-[#E5E7EB] rounded-[4px]" />
                    <span className="font-bold text-[10px]">SMALL</span>
                    <span className="text-[#6B7280] text-[10px] font-mono">4px</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 bg-[#F6F6F6] border border-[#E5E7EB] rounded-[8px]" />
                    <span className="font-bold text-[10px]">MEDIUM</span>
                    <span className="text-[#6B7280] text-[10px] font-mono">8px</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 bg-[#F6F6F6] border border-[#E5E7EB] rounded-[12px]" />
                    <span className="font-bold text-[10px]">LARGE</span>
                    <span className="text-[#6B7280] text-[10px] font-mono">12px</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 bg-[#F6F6F6] border border-[#E5E7EB] rounded-full" />
                    <span className="font-bold text-[10px]">FULL</span>
                    <span className="text-[#6B7280] text-[10px] font-mono">9999px</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* BOTTOM BRAND FOOTER BAR matching UI reference footer */}
          <div className="bg-[#0D0D0F] text-white rounded-[12px] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 font-poppins shadow-ds-lg">
            {/* Left: Brand Logo & Tagline */}
            <div className="flex items-center gap-4">
              <div className="leading-none text-left">
                <span className="font-black text-2xl tracking-tighter text-white lowercase">
                  update<span className="font-extrabold text-white"> me</span>
                </span>
                <span className="font-bold text-[9px] uppercase tracking-[0.22em] text-gray-400 block mt-0.5">
                  News
                </span>
              </div>
              <div className="hidden sm:block h-7 w-[1px] bg-gray-700" />
              <p className="text-xs text-gray-300 hidden sm:block">
                Balanced news coverage,<br />powered by AI.
              </p>
            </div>

            {/* Center: System Version */}
            <div className="text-xs text-gray-400 font-mono text-center">
              Design System v1.0 &nbsp;·&nbsp; June 1, 2026
            </div>

            {/* Right: Brand Motto */}
            <div className="text-xs font-semibold text-gray-300 tracking-wide text-right">
              Stay consistent. Stay unbiased.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
