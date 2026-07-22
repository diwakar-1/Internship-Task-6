"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, MapPin, SlidersHorizontal, User } from "lucide-react";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Logo } from "../ui/Logo";
import { isDummyClerkKey } from "@/lib/clerk/utils";

interface HomeNavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLocationChange?: (location: string) => void;
  onPreferencesChange?: (preferences: string[]) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

const NAV_ITEMS = [
  { id: "Home", label: "HOME" },
  { id: "World", label: "WORLD" },
  { id: "Business", label: "BUSINESS" },
  { id: "Travel", label: "TRAVEL" },
  { id: "Tech", label: "TECH" },
  { id: "For You", label: "FOR YOU" },
  { id: "Local", label: "LOCAL" },
  { id: "Blindspot", label: "BLINDSPOT" },
];

const LOCATIONS = [
  { id: "in", name: "India", city: "New Delhi" },
  { id: "us", name: "United States", city: "Washington, D.C." },
  { id: "au", name: "Australia", city: "Canberra" },
];

const TOPICS = [
  { id: "Weather", label: "Weather & Climate" },
  { id: "Politics", label: "Politics" },
  { id: "Technology", label: "Technology" },
  { id: "Business & Markets", label: "Business & Markets" },
  { id: "World Cup", label: "Sports / World Cup" },
  { id: "IPL", label: "Cricket / IPL" },
  { id: "General", label: "Global News" },
];

function EditorialAuthControls() {
  const isDummy = isDummyClerkKey();

  if (isDummy) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/sign-in">
          <button className="font-mono text-xs uppercase font-bold tracking-wider px-4 py-2 hover:bg-[#111111] hover:text-white transition-colors cursor-pointer border-l border-[#111111] h-full flex items-center">
            SIGN IN
          </button>
        </Link>
      </div>
    );
  }

  return <ClerkControls />;
}

function ClerkControls() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="h-6 w-16 bg-[#DCDAD4] animate-pulse rounded" />;
  }

  if (isSignedIn) {
    return (
      <div className="px-4 py-2 flex items-center border-l border-[#111111] h-full">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7 rounded-full border border-[#111111]",
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center h-full">
      <SignInButton mode="redirect">
        <button className="font-mono text-xs uppercase font-bold tracking-wider px-4 py-2 hover:bg-[#111111] hover:text-white transition-colors cursor-pointer border-l border-[#111111] h-full flex items-center">
          SIGN IN
        </button>
      </SignInButton>
    </div>
  );
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({
  activeTab: externalTab,
  onTabChange,
  onLocationChange,
  onPreferencesChange,
  searchQuery = "",
  onSearchQueryChange,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTabState, setActiveTabState] = useState<string>("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("United States");
  const [userPreferences, setUserPreferences] = useState<string[]>(["Technology", "Politics"]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
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
    }
  }, []);

  const currentTab = externalTab || activeTabState;

  const selectTab = (tab: string) => {
    setActiveTabState(tab);
    if (onTabChange) onTabChange(tab);
    if (tab === "Local") {
      setShowLocationModal(true);
    } else if (tab === "For You" && userPreferences.length === 0) {
      setShowPreferencesModal(true);
    }
  };

  const handleSetLocation = (locName: string) => {
    setSelectedLocation(locName);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_news_location", locName);
    }
    setShowLocationModal(false);
    if (onLocationChange) onLocationChange(locName);
  };

  const handleTogglePreference = (topicId: string) => {
    let updated: string[];
    if (userPreferences.includes(topicId)) {
      updated = userPreferences.filter((t) => t !== topicId);
    } else {
      updated = [...userPreferences, topicId];
    }
    setUserPreferences(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_news_topics", JSON.stringify(updated));
    }
    if (onPreferencesChange) onPreferencesChange(updated);
  };

  return (
    <header className="w-full bg-[#EBEAE5] text-[#111111] font-mono border-b border-[#111111] sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Main Grid Header */}
        <div className="flex items-stretch border-x border-[#111111] border-b border-[#111111] h-14 bg-[#EBEAE5]">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden px-4 flex items-center border-r border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Left Cell: Brand Logo */}
          <Link href="/" className="px-4 flex items-center border-r border-[#111111] hover:bg-white/50 transition-colors">
            <Logo size="sm" showTagline={false} />
          </Link>

          {/* Desktop Tab Grid Cells */}
          <nav className="hidden md:flex items-stretch flex-1 overflow-x-auto select-none">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab.toLowerCase() === item.id.toLowerCase();
              return (
                <button
                  key={item.id}
                  onClick={() => selectTab(item.id)}
                  className={`px-4 sm:px-5 flex items-center justify-center font-mono text-xs font-bold tracking-wider uppercase border-r border-[#111111] transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-[#111111] text-[#EBEAE5]"
                      : "text-[#111111] hover:bg-[#DCDAD4]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-[#EBEAE5]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cells: Search & Auth */}
          <div className="flex items-stretch ml-auto">
            {/* Location indicator button */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 font-mono text-[11px] uppercase font-bold border-l border-[#111111] hover:bg-[#DCDAD4] transition-colors cursor-pointer text-[#111111]"
              title="Change Location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#111111]" />
              <span>{mounted ? selectedLocation.split(" ")[0] : "United"}</span>
            </button>

            {/* Topic preference customize button */}
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="hidden lg:flex items-center gap-1 px-3 font-mono text-[11px] uppercase font-bold border-l border-[#111111] hover:bg-[#DCDAD4] transition-colors cursor-pointer text-[#111111]"
              title="Customize Topics"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#111111]" />
            </button>

            {/* Search Icon Cell */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="px-4 flex items-center border-l border-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sign In Cell */}
            <EditorialAuthControls />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#EBEAE5] border-b border-[#111111] px-4 py-4 space-y-3 font-mono">
          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab.toLowerCase() === item.id.toLowerCase();
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    selectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 text-left border border-[#111111] text-xs font-bold uppercase transition-colors ${
                    isActive ? "bg-[#111111] text-white" : "bg-white/50 text-[#111111] hover:bg-[#111111] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#111111] flex flex-col gap-2">
            <button
              onClick={() => {
                setShowLocationModal(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2 border border-[#111111] text-xs font-bold uppercase bg-white/50"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Location: {selectedLocation}</span>
              </span>
              <span>CHANGE ↗</span>
            </button>
          </div>
        </div>
      )}

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-mono">
          <div className="bg-[#EBEAE5] border-2 border-[#111111] rounded-none max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-[#111111] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#111111]" />
                <h3 className="text-base font-extrabold uppercase font-syne text-[#111111]">SELECT LOCATION</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 hover:bg-[#111111] hover:text-white transition-colors border border-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSetLocation(loc.name)}
                  className={`w-full p-3 border text-left flex items-center justify-between transition-all cursor-pointer uppercase ${
                    selectedLocation === loc.name
                      ? "border-[#111111] bg-[#111111] text-white font-bold"
                      : "border-[#111111] bg-white/60 hover:bg-[#111111] hover:text-white text-[#111111]"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block">{loc.name}</span>
                    <span className="text-[10px] opacity-80">{loc.city}</span>
                  </div>
                  {selectedLocation === loc.name && <span>✦ SELECTED</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Topic Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-mono">
          <div className="bg-[#EBEAE5] border-2 border-[#111111] max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-[#111111] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#111111]" />
                <h3 className="text-base font-extrabold uppercase font-syne text-[#111111]">CUSTOMIZE TOPICS</h3>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-1 hover:bg-[#111111] hover:text-white transition-colors border border-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {TOPICS.map((topic) => {
                const isSelected = userPreferences.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleTogglePreference(topic.id)}
                    className={`p-3 border text-left flex items-center justify-between transition-all cursor-pointer uppercase ${
                      isSelected
                        ? "border-[#111111] bg-[#111111] text-white font-bold"
                        : "border-[#111111] bg-white/60 hover:bg-[#111111] hover:text-white text-[#111111]"
                    }`}
                  >
                    <span className="text-xs">{topic.label}</span>
                    <span className="text-[10px]">{isSelected ? "✦ ACTIVE" : "+ ADD"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs pt-20 px-4 font-mono">
          <div className="bg-[#EBEAE5] border-2 border-[#111111] max-w-xl w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-[#111111] pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#111111]" />
                <h3 className="text-base font-extrabold uppercase font-syne text-[#111111]">SEARCH DISPATCHES</h3>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 hover:bg-[#111111] hover:text-white transition-colors border border-[#111111] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#555555]">Enter keywords, topic, or source name to search articles live:</p>
              <div className="relative flex items-center">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    if (onSearchQueryChange) onSearchQueryChange(e.target.value);
                  }}
                  placeholder="SEARCH NEWS (E.G. WAR, ELECTION, CRICKET, AI)..."
                  className="w-full bg-white border border-[#111111] p-3 text-xs uppercase text-[#111111] placeholder:text-[#888888] outline-none font-bold pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      if (onSearchQueryChange) onSearchQueryChange("");
                    }}
                    className="absolute right-3 text-xs font-bold text-[#111111] hover:underline"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[#111111] text-[11px] font-bold text-[#555555]">
              <span>{searchQuery ? `ACTIVE FILTER: "${searchQuery.toUpperCase()}"` : "NO SEARCH QUERY ENTERED"}</span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="bg-[#111111] text-white text-xs uppercase font-bold px-4 py-2 hover:bg-white hover:text-[#111111] border border-[#111111] transition-all cursor-pointer"
              >
                DONE ✦
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
