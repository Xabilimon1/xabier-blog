export const prerender = true;
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", ({ data }) => !data.draft && data.lang === "es");
  return rss({
    title: "Xabier Ariznabarreta — research notebook",
    description:
      "Builder pivoting to researcher. Notes on LLM evals, mech interp, agent harnesses, and the production lessons that pushed me here.",
    site: context.site ?? "https://xabier.me",
    items: posts
      .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: post.data.publishedAt,
        link: `/posts/${post.id}`,
      })),
    customData: `<language>es-ES</language>`,
  });
}
