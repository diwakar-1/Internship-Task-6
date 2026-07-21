"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Menu, Globe, ChevronDown, MapPin, X, Check, Sparkles, SlidersHorizontal } from "lucide-react";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Logo } from "../ui/Logo";
import { isDummyClerkKey } from "@/lib/clerk/utils";

interface HomeNavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLocationChange?: (location: string) => void;
  onPreferencesChange?: (preferences: string[]) => void;
}

const LOCATIONS = [
  { id: "us", name: "United States", city: "Washington, D.C." },
  { id: "uk", name: "United Kingdom", city: "London" },
  { id: "in", name: "India", city: "New Delhi" },
  { id: "ca", name: "Canada", city: "Ottawa" },
  { id: "au", name: "Australia", city: "Canberra" },
  { id: "global", name: "Global / International", city: "Worldwide" },
];

const EDITIONS = [
  "International Edition",
  "United States Edition",
  "United Kingdom Edition",
  "Asia-Pacific Edition",
];

const TOPICS = [
  { id: "Politics", label: "🏛️ Politics" },
  { id: "Technology", label: "💻 Technology" },
  { id: "Business & Markets", label: "📈 Business & Markets" },
  { id: "World Cup", label: "⚽ Sports / World Cup" },
  { id: "IPL", label: "🏏 Cricket / IPL" },
  { id: "General", label: "🌍 Global News" },
];

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

export const HomeNavbar: React.FC<HomeNavbarProps> = ({
  activeTab: externalTab,
  onTabChange,
  onLocationChange,
  onPreferencesChange,
}) => {
  const [themeMode, setThemeMode] = useState<"Light" | "Dark" | "Auto">("Light");
  const [activeTabState, setActiveTabState] = useState<string>("Home");
  const [selectedLocation, setSelectedLocation] = useState<string>("United States");
  const [selectedEdition, setSelectedEdition] = useState<string>("International Edition");
  const [userPreferences, setUserPreferences] = useState<string[]>(["Technology", "Politics"]);

  // Modal States
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showEditionDropdown, setShowEditionDropdown] = useState<boolean>(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);

  const currentTab = externalTab || activeTabState;

  // Load stored settings from localStorage on mount
  useEffect(() => {
    const storedLoc = localStorage.getItem("user_news_location");
    if (storedLoc) setSelectedLocation(storedLoc);

    const storedPref = localStorage.getItem("user_news_topics");
    if (storedPref) {
      try {
        setUserPreferences(JSON.parse(storedPref));
      } catch {
        // ignore parse error
      }
    }

    const storedTheme = localStorage.getItem("user_theme_mode") as "Light" | "Dark" | "Auto" | null;
    if (storedTheme) setThemeMode(storedTheme);
  }, []);

  const selectTab = (tab: string) => {
    setActiveTabState(tab);
    if (onTabChange) onTabChange(tab);
    posthog.capture("navigation_tab_selected", { tab });

    if (tab === "Local") {
      setShowLocationModal(true);
    } else if (tab === "For You" && userPreferences.length === 0) {
      setShowPreferencesModal(true);
    }
  };

  const handleSetLocation = (locName: string) => {
    setSelectedLocation(locName);
    localStorage.setItem("user_news_location", locName);
    setShowLocationModal(false);
    if (onLocationChange) onLocationChange(locName);
    posthog.capture("user_location_changed", { location: locName });
  };

  const handleTogglePreference = (topicId: string) => {
    let updated: string[];
    if (userPreferences.includes(topicId)) {
      updated = userPreferences.filter((t) => t !== topicId);
    } else {
      updated = [...userPreferences, topicId];
    }
    setUserPreferences(updated);
    localStorage.setItem("user_news_topics", JSON.stringify(updated));
    if (onPreferencesChange) onPreferencesChange(updated);
  };

  const handleThemeChange = (mode: "Light" | "Dark" | "Auto") => {
    setThemeMode(mode);
    localStorage.setItem("user_theme_mode", mode);
    if (mode === "Dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const formattedTodayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="w-full bg-[#F0F0F0] text-[#0D0D0F] font-poppins border-b border-[#E5E7EB] relative z-30">
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
                onClick={() => handleThemeChange("Light")}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  themeMode === "Light" ? "font-bold text-[#0D0D0F] bg-white shadow-xs" : "hover:text-[#0D0D0F]"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange("Dark")}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  themeMode === "Dark" ? "font-bold text-[#0D0D0F] bg-white shadow-xs" : "hover:text-[#0D0D0F]"
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => handleThemeChange("Auto")}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  themeMode === "Auto" ? "font-bold text-[#0D0D0F] bg-white shadow-xs" : "hover:text-[#0D0D0F]"
                }`}
              >
                Auto
              </button>
            </div>
          </div>

          {/* Right: Date, Location, Edition */}
          <div className="flex items-center gap-4 hidden sm:flex">
            <span>{formattedTodayDate}</span>
            <span className="text-gray-300">|</span>

            {/* Working Set Location Button */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="hover:text-[#0D0D0F] transition-colors flex items-center gap-1 cursor-pointer font-medium text-[#1D4ED8]"
              title="Click to change location"
            >
              <MapPin className="w-3 h-3 text-[#1D4ED8]" />
              <span>{selectedLocation}</span>
            </button>

            <span className="text-gray-300">|</span>

            {/* Edition Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setShowEditionDropdown(!showEditionDropdown)}
                className="hover:text-[#0D0D0F] transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <Globe className="w-3 h-3 text-[#6B7280]" />
                <span>{selectedEdition}</span>
                <ChevronDown className="w-3 h-3 text-[#6B7280]" />
              </button>

              {showEditionDropdown && (
                <div className="absolute right-0 top-6 w-48 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg py-1 z-40 text-xs text-[#0D0D0F]">
                  {EDITIONS.map((edition) => (
                    <button
                      key={edition}
                      onClick={() => {
                        setSelectedEdition(edition);
                        setShowEditionDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F6F6F6] flex items-center justify-between cursor-pointer"
                    >
                      <span>{edition}</span>
                      {selectedEdition === edition && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                currentTab === "Home"
                  ? "border-[#0D0D0F] text-[#0D0D0F]"
                  : "border-transparent text-[#6B7280] hover:text-[#0D0D0F]"
              }`}
            >
              Home
            </Link>

            {/* For You Tab */}
            <button
              onClick={() => selectTab("For You")}
              className={`py-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === "For You"
                  ? "border-[#0D0D0F] text-[#0D0D0F]"
                  : "border-transparent text-[#6B7280] hover:text-[#0D0D0F]"
              }`}
            >
              <span>For You</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B42318] inline-block" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreferencesModal(true);
                }}
                title="Customize Topic Preferences"
                className="p-0.5 hover:text-[#0D0D0F] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>
            </button>

            {/* Local Tab */}
            <button
              onClick={() => selectTab("Local")}
              className={`py-1 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                currentTab === "Local"
                  ? "border-[#0D0D0F] text-[#0D0D0F]"
                  : "border-transparent text-[#6B7280] hover:text-[#0D0D0F]"
              }`}
            >
              <span>Local</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-normal border border-emerald-200">
                {selectedLocation.split(" ")[0]}
              </span>
            </button>

            {/* Blindspot Tab */}
            <button
              onClick={() => selectTab("Blindspot")}
              className={`py-1 border-b-2 transition-all cursor-pointer ${
                currentTab === "Blindspot"
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

      {/* 3. SET LOCATION MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-poppins">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 shadow-2xl space-y-5 relative border border-[#E5E7EB]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1D4ED8]" />
                <h3 className="text-base font-bold text-[#0D0D0F]">Set Your Location</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-full hover:bg-[#F6F6F6] text-[#6B7280] hover:text-[#0D0D0F] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              Select your location to personalize local coverage and filter news articles relevant to your area.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSetLocation(loc.name)}
                  className={`w-full p-3 rounded-[10px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedLocation === loc.name
                      ? "border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8]"
                      : "border-[#E5E7EB] hover:bg-[#F6F6F6] text-[#0D0D0F]"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block">{loc.name}</span>
                    <span className="text-[11px] text-[#6B7280]">{loc.city}</span>
                  </div>
                  {selectedLocation === loc.name && <Check className="w-4 h-4 text-[#1D4ED8]" />}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end border-t border-[#E5E7EB]">
              <button
                onClick={() => setShowLocationModal(false)}
                className="bg-[#0D0D0F] text-white text-xs px-5 py-2 rounded-[6px] font-semibold hover:bg-[#1F2937] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TOPIC PREFERENCES MODAL (For You customization) */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-poppins">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 shadow-2xl space-y-5 relative border border-[#E5E7EB]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-[#0D0D0F]">Customize "For You" Feed</h3>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-1 rounded-full hover:bg-[#F6F6F6] text-[#6B7280] hover:text-[#0D0D0F] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              Choose topics you want to follow. Your personalized "For You" feed will automatically prioritize news matching these interests.
            </p>

            <div className="grid grid-cols-1 gap-2">
              {TOPICS.map((topic) => {
                const isSelected = userPreferences.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleTogglePreference(topic.id)}
                    className={`p-3 rounded-[10px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-purple-600 bg-purple-50/70 text-purple-950 font-bold"
                        : "border-[#E5E7EB] hover:bg-[#F6F6F6] text-[#0D0D0F]"
                    }`}
                  >
                    <span className="text-xs">{topic.label}</span>
                    {isSelected ? (
                      <span className="text-xs text-purple-700 bg-purple-200 px-2 py-0.5 rounded-full font-semibold">
                        Selected
                      </span>
                    ) : (
                      <span className="text-xs text-[#6B7280]">+ Add</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end border-t border-[#E5E7EB]">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="bg-[#0D0D0F] text-white text-xs px-5 py-2 rounded-[6px] font-semibold hover:bg-[#1F2937] transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
