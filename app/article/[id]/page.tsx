import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isDummyClerkKey } from "@/lib/clerk/utils";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { BiasMeter } from "@/components/ui/BiasMeter";
import { SidebarBiasAnalysis } from "@/components/article/SidebarBiasAnalysis";
import { SidebarAiSummary } from "@/components/article/SidebarAiSummary";
import { SidebarSourceBreakdown } from "@/components/article/SidebarSourceBreakdown";
import { RelatedStories } from "@/components/article/RelatedStories";
import { NewsletterBanner } from "@/components/article/NewsletterBanner";
import { getArticleById, getRelatedArticles } from "@/lib/supabase/queries/articles";
import { Info, ExternalLink } from "lucide-react";

export const revalidate = 0; // Dynamic data fetching

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // Resource-based Auth Check (Clerk v7+ recommended pattern)
  const isDummy = isDummyClerkKey();

  if (!isDummy) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn();
    }
  }

  const resolvedParams = await params;
  const article = await getArticleById(resolvedParams.id);

  if (!article) {
    notFound();
  }

  const analysis = article.analysis;
  const source = article.source;

  const relatedArticles = await getRelatedArticles(article.id, analysis?.embedding, 5);

  const leftPct = analysis ? Number(analysis.left_percentage) : 33;
  const centerPct = analysis ? Number(analysis.center_percentage) : 34;
  const rightPct = analysis ? Number(analysis.right_percentage) : 33;

  // Split raw text into readable paragraphs
  const rawParagraphs = article.raw_text
    ? article.raw_text.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : ["No raw text content available for this article."];

  const formattedDate = new Date(article.published_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#0D0D0F] font-poppins flex flex-col justify-between">
      <div>
        {/* Top Navbar */}
        <HomeNavbar />

        {/* Main Content Area (1280px Container) */}
        <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          
          {/* 2-Column Grid Layout: Main Article (8 cols) & Sidebar Widgets (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Main Article (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Category · Location */}
              <div className="text-xs font-semibold text-[#6B7280] tracking-wider uppercase flex items-center justify-between">
                <span>{source?.name || "News"} · Global</span>
                {article.canonical_url && (
                  <a
                    href={article.canonical_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1D4ED8] hover:underline flex items-center gap-1 normal-case font-medium"
                  >
                    <span>Original Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Main Headline Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D0D0F] leading-tight tracking-tight font-poppins">
                {article.title}
              </h1>

              {/* Author & Action Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#E5E7EB] text-xs text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0D0D0F]">Source: {source?.name || "Verified Publisher"}</span>
                  <span>|</span>
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Hero Image Container */}
              <div className="space-y-2">
                <div className="aspect-[16/9] rounded-[12px] bg-[#F6F6F6] overflow-hidden border border-[#E5E7EB]">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-[#6B7280] font-normal leading-normal">
                  Source: {source?.name || "Original Publication"}
                </p>
              </div>

              {/* Inline Bias Distribution Box */}
              <div className="bg-white rounded-[12px] p-4 border border-[#E5E7EB] shadow-ds-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6B7280] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span>AI-Estimated Bias Distribution</span>
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>
                <BiasMeter left={leftPct} center={centerPct} right={rightPct} size="md" showLabels={true} />
              </div>

              {/* Main Article Body Text */}
              <div className="space-y-4 text-sm sm:text-base text-[#0D0D0F] leading-relaxed font-poppins pt-2">
                {rawParagraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>

              {/* Related Stories Grid */}
              {relatedArticles.length > 0 && (
                <RelatedStories articles={relatedArticles} />
              )}

            </div>

            {/* RIGHT COLUMN: Sidebar Widgets (4 cols) */}
            <div className="lg:col-span-4 space-y-6 sticky top-20">
              {/* Widget 1: Bias Analysis */}
              <SidebarBiasAnalysis
                biasLabel={analysis?.bias_label || "Center"}
                leftPercentage={leftPct}
                centerPercentage={centerPct}
                rightPercentage={rightPct}
                confidence={analysis ? Number(analysis.confidence) : undefined}
              />

              {/* Widget 2: AI Summary */}
              <SidebarAiSummary
                summary={analysis?.summary}
                disclaimer={analysis?.disclaimer}
                model={analysis?.model}
              />

              {/* Widget 3: Source Breakdown */}
              <SidebarSourceBreakdown
                sourceName={source?.name}
                sourceUrl={source?.listing_url}
              />
            </div>

          </div>

          {/* Newsletter Subscription Banner */}
          <NewsletterBanner />

        </main>
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
