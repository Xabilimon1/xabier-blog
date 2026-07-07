export const prerender = true;

import { generateOpenGraphImage } from "astro-og-canvas";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const png = await generateOpenGraphImage({
    title: "Xabier Ariznabarreta",
    description: "AI agent builder & researcher-in-training · xabier.me",
    bgGradient: [
      [244, 243, 251], // --bg
      [236, 235, 247], // --bg-soft
    ],
    border: {
      color: [252, 100, 113], // --coral
      width: 16,
      side: "inline-start",
    },
    padding: 80,
    font: {
      title: {
        families: ["Poppins"],
        weight: "Bold",
        size: 88,
        lineHeight: 1.1,
        color: [26, 26, 46],
      },
      description: {
        families: ["Poppins"],
        weight: "Medium",
        size: 32,
        lineHeight: 1.4,
        color: [108, 107, 133],
      },
    },
    fonts: [
      "./public/fonts/Poppins-Bold.ttf",
      "./public/fonts/Poppins-Regular.ttf",
    ],
  });

  return new Response(png as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
