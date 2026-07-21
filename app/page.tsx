import React from "react";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { CategoryBar } from "@/components/home/CategoryBar";
import { HomeNewsCard } from "@/components/home/HomeNewsCard";
import { HomeFooter } from "@/components/home/HomeFooter";
import { getArticles } from "@/lib/supabase/queries/articles";
import { Newspaper } from "lucide-react";

export const revalidate = 0; // Dynamic data fetching

export default async function Home() {
  const articles = await getArticles(20);

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#0D0D0F] font-poppins flex flex-col justify-between">
      <div>
        {/* Top Utility & Main Navigation Header */}
        <HomeNavbar />

        {/* Scrollable Category Chips Bar */}
        <CategoryBar />

        {/* Main Content Area */}
        <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          
          {/* Section Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D0D0F] font-poppins tracking-tight">
              Top News
            </h1>
          </div>

          {/* Dynamic News Card Grid or Empty State */}
          {articles.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 sm:p-12 text-center border border-[#E5E7EB] shadow-ds-sm max-w-2xl mx-auto my-8 space-y-4">
              <div className="w-16 h-16 bg-[#F0F0F0] rounded-full flex items-center justify-center mx-auto text-[#6B7280]">
                <Newspaper className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h2 className="text-xl font-bold text-[#0D0D0F]">No Articles Stored Yet</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                The database does not have any scraped articles yet. Run the Oxylabs scraping pipeline to populate active news articles from configured sources into Supabase.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => {
                const analysis = article.analysis;
                const source = article.source;

                return (
                  <HomeNewsCard
                    key={article.id}
                    id={article.id}
                    category={source?.name || "General"}
                    location="Global"
                    title={article.title}
                    imageUrl={article.image_url}
                    leftBias={analysis ? Number(analysis.left_percentage) : 33}
                    centerBias={analysis ? Number(analysis.center_percentage) : 34}
                    rightBias={analysis ? Number(analysis.right_percentage) : 33}
                    sourcesCount={1}
                  />
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* Brand Footer */}
      <HomeFooter />
    </div>
  );
}
