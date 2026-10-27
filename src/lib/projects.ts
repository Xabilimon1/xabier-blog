export type ProjectLink = { label: string; href: string };
export type Project = {
  slug: string; // anchor id on the home page
  name: string;
  status: "open" | "closed";
  subtitle: string; // one line, shown in the index and under the name
  blurb: string;
  parts: string[]; // the stack, lowercase, shown as plain text
  brokeAt?: string; // "where it broke": only real, verified facts
  links: ProjectLink[];
  media?: string; // GIF / WebP / MP4 in /public/projects; no media = empty figure frame
};

// Real projects, honest status, client/institution names anonymized by descriptor.
export const projects: Project[] = [
  {
    slug: "sam",
    name: "SAM",
    status: "closed",
    subtitle: "An LLM agent over a CRM, in production",
    blurb:
      "Production LLM agent over a CRM for a Spanish firm that maintains the exteriors of 2,500+ buildings. A declarative profile-pipeline serving Salesforce (sync) and an Android app (SSE streaming).",
    parts: ["fastapi", "vertex ai", "salesforce", "cloud run"],
    brokeAt:
      "Part of the agent's instructions was being dropped silently on the way to the model, and everything still looked like it worked.",
    links: [{ label: "Read the writeup", href: "/posts/2026-08-03-sam-the-harness-is-the-hard-part" }],
  },
  {
    slug: "lince-reservations",
    name: "LinceReservations",
    status: "closed",
    subtitle: "Study-room booking for a university",
    blurb:
      "Institutional study-room booking platform built to a Madrid university's requirements (pending adoption). Custom OTP + Microsoft SSO, row-level security, five locales, calendar sync.",
    parts: ["react", "typescript", "supabase", "msal"],
    links: [{ label: "Read the writeup", href: "/posts/2026-08-03-building-inside-an-institution" }],
  },
  {
    slug: "numo",
    name: "Numo",
    status: "closed",
    subtitle: "A statistics app that keeps your data on your machine",
    blurb:
      "Local-first desktop statistics app. A real stats engine (pandas / scipy / statsmodels) bundled with the app; your data never leaves your machine, only the interpretation layer talks to a model. In development.",
    parts: ["tauri", "python", "typescript"],
    links: [],
  },
  {
    slug: "emcc",
    name: "EMCC",
    status: "open",
    subtitle: "Every Mod Claude Code: tested mods for Claude Code",
    blurb:
      "A curated, tested collection of mods for Claude Code: 5 mods and 453 tests, listed in the community mods catalogue.",
    parts: ["claude code", "typescript"],
    links: [{ label: "GitHub", href: "https://github.com/Xabilimon1/emcc-claude-code-mods" }],
  },
  {
    slug: "reeljet",
    name: "reeljet",
    status: "open",
    subtitle: "Short video ads from real screen captures",
    blurb:
      "AI short-form video ad generator for apps and SaaS, packaged as a Claude Code skill. Real captures plus generated motion, assembled deterministically with ffmpeg.",
    parts: ["claude code", "ffmpeg", "higgsfield"],
    links: [{ label: "GitHub", href: "https://github.com/Xabilimon1/reeljet" }],
  },
  {
    slug: "token-budget-advisor",
    name: "Token Budget Advisor",
    status: "open",
    subtitle: "Pick a budget before Claude answers",
    blurb:
      "A Claude Code skill that picks a depth/cost budget before Claude answers, so you don't overpay for simple turns. Merged into the everything-claude-code toolkit.",
    parts: ["claude code"],
    links: [
      { label: "GitHub", href: "https://github.com/Xabilimon1/TBA-Token-Budget-Advisor-Claude-Code" },
      { label: "Merged PR", href: "https://github.com/affaan-m/ECC/pull/920" },
    ],
  },
  {
    slug: "save-session",
    name: "save-session",
    status: "open",
    subtitle: "Session memory for Claude Code",
    blurb:
      "A Claude Code skill that writes a compressed, structured summary of a working session to a personal knowledge vault, so context survives across sessions.",
    parts: ["claude code"],
    links: [{ label: "GitHub", href: "https://github.com/Xabilimon1/save-session" }],
  },
];
