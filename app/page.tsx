import React from "react";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingPreview } from "@/components/landing/LandingPreview";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { getArticles } from "@/lib/supabase/queries/articles";

export const revalidate = 0; // Dynamic data fetching

export default async function LandingPage() {
  const articles = await getArticles(10);

  return (
    <div className="min-h-screen bg-[#EBEAE5] text-[#111111] flex flex-col justify-between selection:bg-[#111111] selection:text-white">
      <HomeNavbar />
      
      <main className="flex-1">
        <LandingHero previewArticles={articles} />
        <LandingFeatures />
        <LandingPreview />
        <LandingCTA />
      </main>

      <HomeFooter />
    </div>
  );
}
