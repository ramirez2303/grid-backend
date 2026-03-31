import { fetchAndStoreNews } from "../services/newsService.js";

export async function runNewsFetch(): Promise<number> {
  console.log("Starting news fetch...");
  const count = await fetchAndStoreNews();
  console.log(`News fetch complete: ${count} new articles`);
  return count;
}
