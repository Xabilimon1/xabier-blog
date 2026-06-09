import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(["tech", "research", "production", "meta"]),
    readingMinutes: z.number().int().positive(),
    icon: z.string().default("ph:notebook-fill"),
    color: z.enum(["coral", "mint", "yellow", "purple", "blue"]).default("coral"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
