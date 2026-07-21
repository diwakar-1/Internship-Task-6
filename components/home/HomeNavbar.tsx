"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Menu, Globe, ChevronDown, MapPin } from "lucide-react";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Logo } from "../ui/Logo";
import { isDummyClerkKey } from "@/lib/clerk/utils";

function AuthButtons() {
  const isDummy = isDummyClerkKey();

  if (isDummy) {
    return (
      <>
        <Link href="/sign-up">
          <button className="bg-[#0D0D0F] text-white text-xs px-5 py-2 rounded-[6px] font-semibold hover:bg-[#1F2937] transition-all cursor-pointer">
            Subscribe
          </button>
        </Link>
        <Link href="/sign-in">
          <button className="bg-[#E5E7EB]/80 text-[#0D0D0F] text-xs px-5 py-2 rounded-[6px] font-semibold hover:bg-[#D1D5DB] transition-all cursor-pointer">
            Login
          </button>
        </Link>
      </>
    );
  }

  return <ClerkAuthControls />;
}

function ClerkAuthControls() {
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <div className="h-8 w-24 bg-[#E5E7EB] rounded-md animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8 rounded-full border border-[#E5E7EB]",
          },
        }}
      />
    );
  }

  return (
    <>
      <SignUpButton mode="redirect">
        <button className="bg-[#0D0D0F] text-white text-xs px-5 py-2 rounded-[6px] font-semibold hover:bg-[#1F2937] transition-all cursor-pointer">
          Subscribe
        </button>
      </SignUpButton>
      <SignInButton mode="redirect">
        <button className="bg-[#E5E7EB]/80 text-[#0D0D0F] text-xs px-5 py-2 rounded-[6px] font-semibold hover:bg-[#D1D5DB] transition-all cursor-pointer">
          Login
        </button>
      </SignInButton>
    </>
  );
}

export const HomeNavbar: React.FC = () => {
  const [themeMode, setThemeMode] = useState<"Light" | "Dark" | "Auto">("Light");
  const [activeTab, setActiveTab] = useState<string>("Home");

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    posthog.capture("navigation_tab_selected", { tab });
  };

  return (
    <header className="w-full bg-[#F0F0F0] text-[#0D0D0F] font-poppins border-b border-[#E5E7EB]">
      {/* 1. Top Utility Thin Bar */}
      <div className="bg-[#E5E7EB]/70 border-b border-[#D1D5DB]/60 text-[11px] text-[#6B7280]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-8 flex items-center justify-between">
          {/* Left: Extension & Theme switcher */}
          <div className="flex items-center gap-4">
            <button className="hover:text-[#0D0D0F] transition-colors cursor-pointer">
              Browser Extension
            </button>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5 select-none">
              <span className="text-[#6B7280]">Theme:</span>
              <button
                onClick={() => setThemeMode("Light")}
                className={`px-1.5 py-0.5 rounded ${
                  themeMode === "Light" ? "font-bold text-[#0D0D0F] bg-white/80" : "hover:text-[#0D0D0F]"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setThemeMode("Dark")}
                className={`px-1.5 py-0.5 rounded ${
                  themeMode === "Dark" ? "font-bold text-[#0D0D0F] bg-white/80" : "hover:text-[#0D0D0F]"
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setThemeMode("Auto")}
                className={`px-1.5 py-0.5 rounded ${
                  themeMode === "Auto" ? "font-bold text-[#0D0D0F] bg-white/80" : "hover:text-[#0D0D0F]"
                }`}
              >
                Auto
              </button>
            </div>
          </div>

          {/* Right: Date, Location, Edition */}
          <div className="flex items-center gap-4 hidden sm:flex">
            <span>Monday, June 1, 2026</span>
            <span className="text-gray-300">|</span>
            <button className="hover:text-[#0D0D0F] transition-colors flex items-center gap-1 cursor-pointer">
              <MapPin className="w-3 h-3 text-[#6B7280]" />
              <span>Set Location</span>
            </button>
            <span className="text-gray-300">|</span>
            <button className="hover:text-[#0D0D0F] transition-colors flex items-center gap-1 cursor-pointer font-medium">
              <Globe className="w-3 h-3 text-[#6B7280]" />
              <span>International Edition</span>
              <ChevronDown className="w-3 h-3 text-[#6B7280]" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="bg-[#F0F0F0] border-b border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Menu & Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              aria-label="Open Navigation Menu"
              className="p-2 text-[#0D0D0F] hover:bg-[#E5E7EB] rounded-md transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Brand Logo */}
            <Link href="/">
              <Logo size="sm" showTagline={false} />
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link
              href="/"
              onClick={() => selectTab("Home")}
              className={`py-1 border-b-2 transition-all cursor-pointer ${
                activeTab === "Home"
                  ? "border-[#0D0D0F] text-[#0D0D0F]"
                  : "border-transparent text-[#6B7280] hover:text-[#0D0D0F]"
              }`}
            >
              Home
            </Link>

            <button
              onClick={() => selectTab("For You")}
              className={`py-1 border-b-2 transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "For You"
                  ? "border-[#0D0D0F] text-[#0D0D0F]"
                  : "border-transparent text-[#6B7280] hover:text-[#0D0D0F]"
              }`}
            >
              <span>For You</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B42318] inline-block" />
            </button>

            <button
              onClick={() => selectTab("Local")}
              className={`py-1 border-b-2 transition-all cursor-pointer ${
                activeTab === "Local"
                  ? "border-[#0D0D0F] text-[#0D0D0F]"
                  : "border-transparent text-[#6B7280] hover:text-[#0D0D0F]"
              }`}
            >
              Local
            </button>

            <button
              onClick={() => selectTab("Blindspot")}
              className={`py-1 border-b-2 transition-all cursor-pointer ${
                activeTab === "Blindspot"
                  ? "border-[#0D0D0F] text-[#0D0D0F]"
                  : "border-transparent text-[#6B7280] hover:text-[#0D0D0F]"
              }`}
            >
              Blindspot
            </button>
          </nav>

          {/* Right: Clerk Action Buttons / User Menu */}
          <div className="flex items-center gap-3">
            <AuthButtons />
          </div>

        </div>
      </div>
    </header>
  );
};
