/**
 * Utility to ensure every article gets a distinct, high-quality visual image.
 * Prevents identical or duplicate images across news cards.
 */

const DIVERSE_NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80", // Capitol / Politics
  "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80", // Defense / Aircraft / Military
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80", // Markets / Economy
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80", // Global Finance
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", // Technology / AI
  "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80", // Diplomacy / Press Conference
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", // Global Network / World News
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80", // International Summit
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80", // Newspaper / Publishing
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80", // Live News Broadcast
];

export function getDistinctArticleImage(
  articleId: string | number,
  title: string,
  imageUrl?: string | null,
  seenSet?: Set<string>
): string {
  // If imageUrl exists, is absolute http, is not generic logo/placeholder, and not seen yet in this list
  const isGenericLogo =
    !imageUrl ||
    imageUrl.includes("logo") ||
    imageUrl.includes("blot") ||
    imageUrl.includes("icon") ||
    imageUrl.includes("favicon") ||
    imageUrl.endsWith(".svg");

  if (imageUrl && !isGenericLogo && imageUrl.startsWith("http")) {
    if (!seenSet || !seenSet.has(imageUrl)) {
      if (seenSet) seenSet.add(imageUrl);
      return imageUrl;
    }
  }

  // Deterministically hash articleId + title to pick a distinct photo from DIVERSE_NEWS_IMAGES
  let hash = 0;
  const str = String(articleId) + title;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  let index = Math.abs(hash) % DIVERSE_NEWS_IMAGES.length;
  let fallback = DIVERSE_NEWS_IMAGES[index];

  // If fallback already used in this list, pick next available slot
  if (seenSet) {
    let attempts = 0;
    while (seenSet.has(fallback) && attempts < DIVERSE_NEWS_IMAGES.length) {
      index = (index + 1) % DIVERSE_NEWS_IMAGES.length;
      fallback = DIVERSE_NEWS_IMAGES[index];
      attempts++;
    }
    seenSet.add(fallback);
  }

  return fallback;
}
