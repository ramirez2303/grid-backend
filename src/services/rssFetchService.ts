import Parser from "rss-parser";

const parser = new Parser({ timeout: 10000, customFields: { item: [["media:content", "media"], ["media:thumbnail", "mediaThumbnail"]] } });

function extractImageFromItem(enclosure: { url?: string } | undefined, media: { $?: { url?: string } } | undefined, thumb: { $?: { url?: string } } | undefined, content: string): string | null {
  if (enclosure?.url) return enclosure.url;
  if (media?.$?.url) return media.$.url;
  if (thumb?.$?.url) return thumb.$.url;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch?.[1]) return imgMatch[1];
  return null;
}

const RSS_FEEDS = [
  { url: "https://www.formula1.com/content/fom-website/en/latest/all.xml", source: "formula1.com" },
  { url: "https://www.motorsport.com/rss/f1/news/", source: "motorsport.com" },
  { url: "https://the-race.com/feed/", source: "the-race.com" },
  { url: "https://www.autosport.com/rss/f1/news/", source: "autosport.com" },
  { url: "https://racefans.net/feed/", source: "racefans.net" },
];

export interface RawNewsItem {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  imageUrl: string | null;
  publishedAt: Date;
}

export async function fetchAllRssFeeds(): Promise<RawNewsItem[]> {
  const results: RawNewsItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      console.log(`[RSS] ${feed.source}: ${parsed.items.length} items`);

      for (const item of parsed.items) {
        if (!item.title || !item.link) continue;
        results.push({
          title: item.title.trim(),
          summary: (item.contentSnippet ?? item.content ?? "").slice(0, 500).trim(),
          source: feed.source,
          sourceUrl: item.link,
          imageUrl: extractImageFromItem(item.enclosure, item.media, item.mediaThumbnail, String(item.content ?? "")),
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[RSS] Failed to fetch ${feed.source}: ${msg}`);
    }
  }

  return results;
}
