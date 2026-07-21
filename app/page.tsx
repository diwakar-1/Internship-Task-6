import React from "react";
import { HomeNewsFeed } from "@/components/home/HomeNewsFeed";
import { getArticles } from "@/lib/supabase/queries/articles";

export const revalidate = 0; // Dynamic data fetching

export default async function Home() {
  const articles = await getArticles(30);

  return <HomeNewsFeed initialArticles={articles} />;
}
