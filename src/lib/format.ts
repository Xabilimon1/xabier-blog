export type Category = "tech" | "research" | "production" | "meta";

const labels: Record<"es" | "en", Record<Category, string>> = {
  en: { tech: "Deep dive", research: "Research note", production: "Production lesson", meta: "Logbook" },
  es: { tech: "A fondo", research: "Nota de investigación", production: "Lección de producción", meta: "Bitácora" },
};

export const categoryLabel = (c: Category, lang: "es" | "en") => labels[lang][c];

// YYYY-MM-DD in Madrid time, the way a commit log would print it.
export const isoDate = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(d);
