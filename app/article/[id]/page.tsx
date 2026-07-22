import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isDummyClerkKey } from "@/lib/clerk/utils";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { SidebarBiasAnalysis } from "@/components/article/SidebarBiasAnalysis";
import { SidebarAiSummary } from "@/components/article/SidebarAiSummary";
import { SidebarSourceBreakdown } from "@/components/article/SidebarSourceBreakdown";
import { RelatedStories } from "@/components/article/RelatedStories";
import { getArticleById, getRelatedArticles } from "@/lib/supabase/queries/articles";
import { getDistinctArticleImage } from "@/lib/utils/image";
import { ExternalLink } from "lucide-react";

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
    <div className="min-h-screen bg-[#EBEAE5] text-[#111111] font-sans flex flex-col justify-between selection:bg-[#111111] selection:text-white">
      <div>
        {/* Top Navbar */}
        <HomeNavbar />

        {/* Main Content Container */}
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          
          {/* 2-Column Editorial Grid Layout: Main Article (8 cols) & Sidebar (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Main Article Body */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Category Header */}
              <div className="font-mono text-xs font-bold text-[#555555] uppercase tracking-widest flex items-center justify-between border-b border-[#111111] pb-2">
                <span>— {source?.name || "News"} ✦ DISPATCH</span>
                {article.canonical_url && (
                  <a
                    href={article.canonical_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#111111] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>ORIGINAL SOURCE</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Main Editorial Headline */}
              <h1 className="font-syne font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#111111] leading-tight uppercase tracking-tight">
                {article.title}
              </h1>

              {/* Metadata Bar */}
              <div className="font-mono text-xs text-[#333333] py-2 border-y border-[#111111] flex flex-wrap gap-4 uppercase font-bold">
                <span>PUBLISHER: {source?.name || "VERIFIED"}</span>
                <span>✦</span>
                <span>DATE: {formattedDate}</span>
              </div>

              {/* Framed Featured Article Image with Corner Ticks */}
              <div className="relative border-2 border-[#111111] bg-white p-2">
                <span className="absolute top-1 left-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌜</span>
                <span className="absolute top-1 right-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌝</span>
                <span className="absolute bottom-1 left-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌞</span>
                <span className="absolute bottom-1 right-1.5 text-[10px] text-[#111111] pointer-events-none select-none z-10">⌟</span>
                
                <div className="aspect-[16/9] overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-300">
                  <img
                    src={getDistinctArticleImage(article.id, article.title, article.image_url)}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-mono text-[10px] text-[#555555] uppercase pt-2 text-center">
                  PHOTOGRAPH DISPATCH — {source?.name || "ORIGINAL PUBLICATION"}
                </p>
              </div>

              {/* Editorial AI Summary Infobox Stamp */}
              {analysis?.summary && (
                <div className="border-2 border-[#111111] bg-[#F3F2ED] p-6 font-mono space-y-3 relative shadow-[4px_4px_0px_0px_#111111]">
                  <div className="flex items-center justify-between border-b border-[#111111] pb-2">
                    <span className="text-xs font-extrabold text-[#111111] uppercase tracking-wider">
                      ✨ EXECUTIVE AI DISPATCH SUMMARY
                    </span>
                    <span className="text-[10px] font-bold text-[#111111] border border-[#111111] bg-white px-2 py-0.5 uppercase">
                      MODEL: {analysis.model || "gpt-4o-mini"}
                    </span>
                  </div>
                  <p className="text-xs text-[#222222] leading-relaxed font-sans font-medium whitespace-pre-line">
                    {analysis.summary}
                  </p>
                  {analysis.disclaimer && (
                    <p className="text-[10px] text-[#555555] italic pt-1 border-t border-[#111111]/30">
                      {analysis.disclaimer}
                    </p>
                  )}
                </div>
              )}

              {/* Main Article Body Text with Drop Cap */}
              <div className="space-y-4 text-sm sm:text-base text-[#111111] leading-relaxed font-sans pt-4 border-t border-[#111111]">
                {rawParagraphs.map((para, index) => (
                  <p key={index} className={index === 0 ? "drop-cap" : ""}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Related Stories Grid */}
              {relatedArticles.length > 0 && (
                <div className="pt-6 border-t-2 border-[#111111]">
                  <RelatedStories articles={relatedArticles} />
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Sidebar Infoboxes */}
            <div className="lg:col-span-4 space-y-6 font-mono">
              <div className="border-2 border-[#111111] bg-[#F3F2ED] p-5 space-y-4 shadow-[4px_4px_0px_0px_#111111]">
                <SidebarBiasAnalysis
                  biasLabel={analysis?.bias_label || "Center"}
                  leftPercentage={leftPct}
                  centerPercentage={centerPct}
                  rightPercentage={rightPct}
                  confidence={analysis ? Number(analysis.confidence) : undefined}
                />
              </div>

              <div className="border-2 border-[#111111] bg-[#F3F2ED] p-5 space-y-4 shadow-[4px_4px_0px_0px_#111111]">
                <SidebarAiSummary
                  summary={analysis?.summary}
                  disclaimer={analysis?.disclaimer}
                  model={analysis?.model}
                  articleId={article.id}
                />
              </div>

              <div className="border-2 border-[#111111] bg-[#F3F2ED] p-5 space-y-4 shadow-[4px_4px_0px_0px_#111111]">
                <SidebarSourceBreakdown
                  sourceName={source?.name}
                  sourceUrl={source?.listing_url}
                />
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Editorial Footer */}
      <HomeFooter />
    </div>
  );
}
