// OAuth callback for Decap CMS.
// Receives ?code=... from GitHub, exchanges for an access token, validates
// the authenticated user is the repo owner (login + numeric id), then posts
// the token back to the Decap CMS popup opener via postMessage.

import type { APIRoute } from "astro";

export const prerender = false;

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_API = "https://api.github.com";

// Identity invariants for THIS deployment. Pinning both login and numeric id
// because login can be renamed but the numeric id is permanent. If you ever
// rename your GitHub account, update the login; the id stays.
const ALLOWED_LOGIN = "Xabilimon1";
const ALLOWED_USER_ID = 237823862;

// The production origin where Decap CMS is served. Must match exactly the
// "Authorization callback URL" registered on the GitHub OAuth App.
const PROD_ORIGIN = "https://xabier-blog.vercel.app";

function parseCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  const parts = header.split(/;\s*/);
  for (const p of parts) {
    const eq = p.indexOf("=");
    if (eq < 0) continue;
    if (p.slice(0, eq) === name) return decodeURIComponent(p.slice(eq + 1));
  }
  return null;
}

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

function errorResponse(message: string, allowedOrigin: string): Response {
  // Notify the opener so Decap can show a useful error instead of hanging.
  // Important: post to a strict origin, never "*", even in the error path.
  // GitHub error_description is capped to avoid pathological payloads.
  const safe = JSON.stringify(message.slice(0, 200));
  const target = JSON.stringify(allowedOrigin);
  return new Response(
    `<!doctype html><html><body><script>
  (function () {
    var opener = window.opener;
    if (opener) {
      try { opener.postMessage("authorization:github:error:" + ${safe}, ${target}); } catch (e) {}
    }
    document.body.textContent = ${safe};
  })();
</script></body></html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}

export const GET: APIRoute = async ({ request, url }) => {
  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.OAUTH_GITHUB_CLIENT_SECRET;

  // Pin to the production origin in production. The OAuth app's callback URL
  // is registered to one host on GitHub; any mismatch with the redirect_uri
  // sent at authorize time would make GitHub refuse the token exchange.
  const origin = import.meta.env.PROD ? PROD_ORIGIN : getOrigin(request);

  if (!clientId || !clientSecret) {
    console.error("[decap-oauth/callback] missing OAuth env vars");
    return errorResponse("OAuth is not configured on the server.", origin);
  }

  // 1. Validate `state` against the cookie set by /api/auth.
  const stateFromQuery = url.searchParams.get("state");
  const cookieState = parseCookie(
    request.headers.get("cookie"),
    "__Host-decap_oauth_state",
  );
  if (!stateFromQuery || !cookieState || stateFromQuery !== cookieState) {
    console.error("[decap-oauth/callback] state mismatch", {
      hasQueryState: Boolean(stateFromQuery),
      hasCookieState: Boolean(cookieState),
    });
    return errorResponse("OAuth state mismatch. Refusing to continue.", origin);
  }

  // 2. Exchange the code for an access token.
  const code = url.searchParams.get("code");
  if (!code) {
    console.error("[decap-oauth/callback] missing code");
    return errorResponse("Missing OAuth code.", origin);
  }

  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "xabier-blog-decap-oauth",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${origin}/api/callback`,
    }),
  });

  if (!tokenRes.ok) {
    console.error("[decap-oauth/callback] token exchange HTTP error", {
      status: tokenRes.status,
    });
    return errorResponse("GitHub token exchange failed.", origin);
  }

  const tokenBody = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (tokenBody.error || !tokenBody.access_token) {
    console.error("[decap-oauth/callback] token exchange returned error", {
      error: tokenBody.error,
    });
    return errorResponse(
      `OAuth error: ${tokenBody.error ?? "unknown"}`,
      origin,
    );
  }
  const accessToken = tokenBody.access_token;

  // 3. Verify the authenticated user IS the repo owner. Pin both login and
  // numeric id — login can be renamed; id can't.
  const userRes = await fetch(`${GITHUB_API}/user`, {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "xabier-blog-decap-oauth",
    },
  });
  if (!userRes.ok) {
    console.error("[decap-oauth/callback] /user fetch failed", {
      status: userRes.status,
    });
    return errorResponse("Could not verify user identity.", origin);
  }
  const userJson = (await userRes.json()) as {
    login?: string;
    id?: number;
  };
  if (
    userJson.login !== ALLOWED_LOGIN ||
    userJson.id !== ALLOWED_USER_ID
  ) {
    console.error("[decap-oauth/callback] identity mismatch", {
      login: userJson.login,
      id: userJson.id,
    });
    return errorResponse(
      "Access denied. This CMS is restricted to the repo owner.",
      origin,
    );
  }

  // 4. Post the token back to the opener via postMessage with a strict
  // target origin. Opener is on the same origin as us (same Vercel deploy).
  const payload = JSON.stringify({
    token: accessToken,
    provider: "github",
  });
  const allowedOrigin = JSON.stringify(origin);

  return new Response(
    `<!doctype html><html><body>
<script>
  (function () {
    var data = ${payload};
    var allowed = ${allowedOrigin};
    var opener = window.opener;
    if (!opener) {
      document.body.textContent = "No opener window — close this tab.";
      return;
    }
    try {
      function postSuccess() {
        opener.postMessage(
          "authorization:github:success:" + JSON.stringify(data),
          allowed
        );
      }
      window.addEventListener("message", function (e) {
        if (e.origin !== allowed) return;
        if (e.data === "authorizing:github") postSuccess();
      });
      postSuccess();
      setTimeout(function () { window.close(); }, 1000);
      document.body.textContent = "Signed in. You can close this window.";
    } catch (err) {
      document.body.textContent = "Postback failed: " + err.message;
    }
  })();
</script>
</body></html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        // Clear the state cookie now that we're done.
        "Set-Cookie":
          "__Host-decap_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
};
