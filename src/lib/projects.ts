export type ProjectLink = { label: string; href: string };
export type Project = {
  slug: string; // anchor id on the home page
  name: string;
  status: "open" | "closed";
  blurb: string;
  parts: string[]; // the stack, lowercase, shown as plain text
  brokeAt?: string; // "where it broke": only real, verified facts
  links: ProjectLink[];
  media?: string; // GIF / WebP / MP4 in /public/projects; no media = empty figure frame
  fit?: "contain"; // show the whole media (e.g. terminal text up to the edges) instead of cropping it to 16:10
};

// Real projects, honest status, client/institution names anonymized by descriptor.
export const projects: Project[] = [
  {
    slug: "sam",
    name: "SAM",
    status: "closed",
    blurb:
      "LLM agent over the CRM of a firm that maintains 2,500+ building exteriors, serving Salesforce and an Android app from one engine.",
    parts: ["fastapi", "vertex ai", "salesforce", "cloud run"],
    brokeAt: "Instructions were dropped silently on the way to the model; everything still looked fine.",
    links: [{ label: "Read the writeup", href: "/posts/2026-08-03-sam-the-harness-is-the-hard-part" }],
    media: "/projects/sam.mp4",
  },
  {
    slug: "lince-reservations",
    name: "LinceReservations",
    status: "closed",
    blurb:
      "Study-room booking for a Madrid university, built to its rules: OTP and Microsoft SSO, row-level security, five languages. Pending adoption.",
    parts: ["react", "typescript", "supabase", "msal"],
    brokeAt: "The insert policy only checked that you were signed in, so any student could book under someone else's email. Fixed in migration 21; the replay shows both.",
    links: [{ label: "Read the writeup", href: "/posts/2026-08-03-building-inside-an-institution" }],
    media: "/projects/lince.mp4",
  },
  {
    slug: "numo",
    name: "Numo",
    status: "closed",
    blurb:
      "Local-first statistics app: the stats engine runs on your machine and your data never leaves it. In development.",
    parts: ["tauri", "python", "typescript"],
    links: [],
    media: "/projects/numo.gif",
  },
  {
    slug: "emcc",
    name: "EMCC",
    status: "open",
    blurb:
      "Five tested mods for Claude Code (453 tests), listed in the community mods catalogue.",
    parts: ["claude code", "typescript"],
    links: [{ label: "GitHub", href: "https://github.com/Xabilimon1/emcc-claude-code-mods" }],
    media: "/projects/emcc.gif",
    fit: "contain",
  },
  {
    slug: "token-budget-advisor",
    name: "Token Budget Advisor",
    status: "open",
    blurb:
      "Picks a depth and cost budget before Claude answers. Merged into everything-claude-code.",
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
    blurb:
      "Saves a compressed summary of each Claude Code session to a notes vault, so context carries over.",
    parts: ["claude code"],
    links: [{ label: "GitHub", href: "https://github.com/Xabilimon1/save-session" }],
  },
];
