export type ProjectLink = { label: string; href: string };
export type Project = {
  name: string;
  status: "open" | "closed";
  blurb: string;
  tags: string[];
  links: ProjectLink[];
  image?: string; // optional screenshot in /public; falls back to a mono cover
};

// Real projects, honest status, client/institution names anonymized by descriptor.
export const projects: Project[] = [
  {
    name: "SAM",
    status: "closed",
    blurb:
      "Production LLM agent over a CRM for a Spanish firm that maintains the exteriors of 2,500+ buildings. A declarative profile-pipeline serving Salesforce (sync) and an Android app (SSE streaming).",
    tags: ["FastAPI", "Vertex AI", "Salesforce", "Cloud Run"],
    links: [{ label: "Read the writeup", href: "/posts/2026-08-03-sam-the-harness-is-the-hard-part" }],
  },
  {
    name: "LinceReservations",
    status: "closed",
    blurb:
      "Institutional study-room booking platform built to a Madrid university's requirements (pending adoption). Custom OTP + Microsoft SSO, row-level security, five locales, calendar sync.",
    tags: ["React", "TypeScript", "Supabase", "MSAL"],
    links: [{ label: "Read the writeup", href: "/posts/2026-08-03-building-inside-an-institution" }],
  },
  {
    name: "Numo",
    status: "closed",
    blurb:
      "Local-first desktop statistics app. A real stats engine (pandas / scipy / statsmodels) bundled with the app; your data never leaves your machine, only the interpretation layer talks to a model. In development.",
    tags: ["Tauri", "Python", "TypeScript"],
    links: [],
  },
  {
    name: "reeljet",
    status: "open",
    blurb:
      "AI short-form video ad generator for apps and SaaS, packaged as a Claude Code skill. Real captures plus generated motion, assembled deterministically with ffmpeg.",
    tags: ["Claude Code", "ffmpeg", "Higgsfield"],
    links: [{ label: "GitHub", href: "https://github.com/Xabilimon1/reeljet" }],
  },
  {
    name: "Token Budget Advisor",
    status: "open",
    blurb:
      "A Claude Code skill that picks a depth/cost budget before Claude answers, so you don't overpay for simple turns. Merged into the everything-claude-code toolkit.",
    tags: ["Claude Code"],
    links: [
      { label: "GitHub", href: "https://github.com/Xabilimon1/TBA-Token-Budget-Advisor-Claude-Code" },
      { label: "Merged PR", href: "https://github.com/affaan-m/ECC/pull/920" },
    ],
  },
  {
    name: "save-session",
    status: "open",
    blurb:
      "A Claude Code skill that writes a compressed, structured summary of a working session to a personal knowledge vault, so context survives across sessions.",
    tags: ["Claude Code"],
    links: [{ label: "GitHub", href: "https://github.com/Xabilimon1/save-session" }],
  },
];
