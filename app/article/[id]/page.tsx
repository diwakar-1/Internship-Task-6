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
import { getArticleById, getRelatedArticles } from "@/lib/supabase/queries/articles";
import { getDistinctArticleImage } from "@/lib/utils/image";
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

  const rawAnalysis = article.analysis;
  const analysis = Array.isArray(rawAnalysis) ? (rawAnalysis.length > 0 ? rawAnalysis[0] : undefined) : rawAnalysis;
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
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#0B0F19] text-[#0D0D0F] dark:text-slate-100 font-poppins flex flex-col justify-between">
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
              <div className="text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8] tracking-wider uppercase flex items-center justify-between">
                <span>{source?.name || "News"} · Global</span>
                {article.canonical_url && (
                  <a
                    href={article.canonical_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1D4ED8] dark:text-blue-400 hover:underline flex items-center gap-1 normal-case font-medium"
                  >
                    <span>Original Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Main Headline Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D0D0F] dark:text-slate-100 leading-tight tracking-tight font-poppins">
                {article.title}
              </h1>

              {/* Author & Action Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#E5E7EB] dark:border-[#334155] text-xs text-[#6B7280] dark:text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0D0D0F] dark:text-slate-100">Source: {source?.name || "Verified Publisher"}</span>
                  <span>|</span>
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Hero Image Container */}
              <div className="space-y-2">
                <div className="aspect-[16/9] rounded-[12px] bg-[#F6F6F6] dark:bg-[#0F172A] overflow-hidden border border-[#E5E7EB] dark:border-[#334155]">
                  <img
                    src={getDistinctArticleImage(article.id, article.title, article.image_url)}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-normal leading-normal">
                  Source: {source?.name || "Original Publication"}
                </p>
              </div>

              {/* Inline Bias Distribution Box */}
              <div className="bg-white dark:bg-[#1E293B] rounded-[12px] p-4 border border-[#E5E7EB] dark:border-[#334155] shadow-ds-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#94A3B8] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span>AI-Estimated Bias Distribution</span>
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>
                <BiasMeter left={leftPct} center={centerPct} right={rightPct} size="md" showLabels={true} />
              </div>

              {/* Prominent Executive AI Summary Highlight Box */}
              {analysis?.summary && (
                <div className="bg-gradient-to-r from-blue-50/90 dark:from-blue-950/30 via-indigo-50/70 dark:via-indigo-950/20 to-slate-50 dark:to-slate-900/40 rounded-[12px] p-5 border border-blue-100/90 dark:border-blue-900/50 shadow-ds-sm space-y-2 font-poppins">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1D4ED8] dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      ✨ Executive AI Article Summary
                    </span>
                    <span className="text-[10px] text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/40 px-2 py-0.5 rounded font-semibold">
                      {analysis.model || "gpt-4o-mini"}
                    </span>
                  </div>
                  <p className="text-sm text-[#1F2937] dark:text-[#E2E8F0] leading-relaxed font-normal whitespace-pre-line">
                    {analysis.summary}
                  </p>
                  {analysis.disclaimer && (
                    <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] italic pt-1 border-t border-blue-100/60 dark:border-blue-900/30">
                      {analysis.disclaimer}
                    </p>
                  )}
                </div>
              )}

              {/* Main Article Body Text */}
              <div className="space-y-4 text-sm sm:text-base text-[#0D0D0F] dark:text-[#E2E8F0] leading-relaxed font-poppins pt-2">
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
            <div className="lg:col-span-4 space-y-6">
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
                articleId={article.id}
              />

              {/* Widget 3: Source Breakdown */}
              <SidebarSourceBreakdown
                sourceName={source?.name}
                sourceUrl={source?.listing_url}
              />
            </div>

          </div>

        </main>
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
