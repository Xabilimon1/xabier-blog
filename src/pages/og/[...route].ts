export const prerender = true;

import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";
import type { RGBColor } from "astro-og-canvas/dist/types";

type CategoryColor = "coral" | "mint" | "yellow" | "purple" | "blue";

const COLOR_MAP: Record<CategoryColor, { start: RGBColor; end: RGBColor; accent: RGBColor }> = {
  coral:  { start: [255, 232, 232], end: [252, 210, 213], accent: [239,  71,  89] },
  mint:   { start: [225, 249, 240], end: [200, 240, 224], accent: [ 26, 175, 130] },
  yellow: { start: [255, 246, 220], end: [255, 235, 190], accent: [236, 179,  68] },
  purple: { start: [235, 232, 253], end: [220, 214, 250], accent: [126, 114, 217] },
  blue:   { start: [230, 238, 254], end: [210, 224, 252], accent: [ 62, 108, 200] },
};

const INK: RGBColor = [26, 26, 46];       // --ink-900
const INK_500: RGBColor = [108, 107, 133]; // --ink-500

const posts = await getCollection("posts", ({ data }) => !data.draft);

type PageData = {
  title: string;
  excerpt: string;
  color: CategoryColor;
  category: string;
  lang: "es" | "en";
};

const pages: Record<string, PageData> = {};
for (const post of posts) {
  pages[post.id] = {
    title: post.data.title,
    excerpt: post.data.excerpt,
    color: post.data.color as CategoryColor,
    category: post.data.category,
    lang: post.data.lang,
  };
}

const categoryLabel = (c: string, lang: "es" | "en") =>
  c === "tech" ? "Tech" :
  c === "research" ? "Research" :
  c === "production" ? (lang === "es" ? "Producción" : "Production") :
  "Meta";

export const { getStaticPaths, GET } = await OGImageRoute<PageData>({
  pages,
  param: "route",
  getImageOptions: (_path, page) => {
    const palette = COLOR_MAP[page.color] ?? COLOR_MAP.coral;
    const badge = `${categoryLabel(page.category, page.lang)} · xabier.me`;

    return {
      title: page.title,
      description: badge,
      bgGradient: [palette.start, palette.end],
      border: {
        color: palette.accent,
        width: 16,
        side: "inline-start",
      },
      padding: 80,
      font: {
        title: {
          families: ["Poppins"],
          weight: "Bold",
          size: 78,
          lineHeight: 1.1,
          color: INK,
        },
        description: {
          families: ["Poppins"],
          weight: "Medium",
          size: 30,
          lineHeight: 1.4,
          color: INK_500,
        },
      },
      fonts: [
        "./public/fonts/Poppins-Bold.ttf",
        "./public/fonts/Poppins-Regular.ttf",
      ],
    };
  },
});
