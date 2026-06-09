// OAuth start endpoint for Decap CMS.
// Reference: https://decapcms.org/docs/external-oauth-clients/
//
// Flow:
//   1. Decap CMS opens /api/auth as a popup.
//   2. We bounce the user to GitHub with the right scope + state.
//   3. GitHub redirects to /api/callback with a code.
//   4. /api/callback exchanges the code for a token, validates the user is
//      Xabilimon1 (login + numeric id), and posts the token back to Decap.

import type { APIRoute } from "astro";

export const prerender = false;

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";

// The OAuth App's "Authorization callback URL" on GitHub is registered to
// exactly this origin. We pin to it in production so a spoofed `x-forwarded-host`
// can't redirect us elsewhere, and so the redirect_uri sent at /api/callback
// matches what we sent here.
const PROD_ORIGIN = "https://xabier-blog.vercel.app";

function getOrigin(request: Request): string {
  const proto =
    request.headers.get("x-forwarded-proto") ??
    new URL(request.url).protocol.replace(":", "");
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    new URL(request.url).host;
  return `${proto}://${host}`;
}

function randomState(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const GET: APIRoute = async ({ request }) => {
  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error("[decap-oauth/auth] missing OAUTH_GITHUB_CLIENT_ID");
    return new Response(
      "OAuth is not configured. OAUTH_GITHUB_CLIENT_ID env var is missing.",
      { status: 500 },
    );
  }

  // Use the pinned production origin in production; fall back to the request
  // origin in dev/preview so local development still works.
  const origin = import.meta.env.PROD ? PROD_ORIGIN : getOrigin(request);
  const state = randomState();
  const redirectUri = `${origin}/api/callback`;

  const url = new URL(GITHUB_AUTHORIZE);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  // public_repo is sufficient for a public repo and avoids granting access to
  // every private repo the user owns. Decap CMS only needs read/write on this
  // one public repo.
  url.searchParams.set("scope", "public_repo");
  url.searchParams.set("state", state);

  // Persist `state` as a short-lived, HttpOnly, host-bound cookie.
  // `__Host-` prefix forces Path=/, Secure, no Domain attribute — prevents
  // subdomain cookie injection.
  const cookie = [
    `__Host-decap_oauth_state=${state}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=600",
  ].join("; ");

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": cookie,
      "Cache-Control": "no-store",
    },
  });
};
