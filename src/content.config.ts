import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Coerce `publishedAt` defensively so a bare `YYYY-MM-DD` from Decap doesn't
// shift to the previous day when rendered in Madrid (UTC+1/+2). If only a
// date is provided we anchor it to noon UTC so it never drifts more than ±12h
// across any timezone.
const dateField = z
  .union([z.string(), z.date()])
  .transform((v) =>
    typeof v === "string"
      ? new Date(v.length === 10 ? `${v}T12:00:00Z` : v)
      : v,
  );

const posts = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!README.md", "!readme.md"],
    base: "./src/content/posts",
  }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: dateField,
    updatedAt: dateField.optional(),
    category: z.enum(["tech", "research", "production", "meta"]),
    readingMinutes: z.number().int().positive(),
    icon: z.string().default("ph:notebook-fill"),
    color: z.enum(["coral", "mint", "yellow", "purple", "blue"]).default("coral"),
    draft: z.boolean().default(false),
    lang: z.enum(["es", "en"]).default("es"),
    translationOf: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    noindex: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

export const collections = { posts };
