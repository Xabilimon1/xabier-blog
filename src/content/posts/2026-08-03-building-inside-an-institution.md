---
title: "LinceReservations: the constraints you don't get to choose"
excerpt: "I built a room-booking platform for my university's study spaces, designed around the institution's own rules. It isn't deployed yet. The hard part was never React. It was everything the institution had already decided for me."
publishedAt: "2026-08-03"
category: "production"
readingMinutes: 6
icon: "ph:buildings-fill"
color: "blue"
lang: "en"
translationOf: "2026-08-03-construir-dentro-de-una-institucion"
draft: false
keywords:
  - "full-stack"
  - "institutional software"
  - "authentication"
  - "row-level security"
  - "Supabase"
  - "React"
---

The other case study I wrote here was about an agent, and the lesson was that the model was never the hard part. This one is about a much more ordinary piece of software, a web app for booking study rooms, and the lesson rhymes. The framework was never the bottleneck either. The difficulty came from building it for an institution, where most of the decisions you'd normally own have already been made for you.

The app is LinceReservations, a study-room reservation platform I built for my university's study spaces. I should be upfront about its status, because it frames everything below: it isn't deployed. I built it as a complete product, with authentication, role-based access, an admin console, calendar integration and five locales, all against the university's real requirements, and it's currently under review for adoption. So this isn't a "we run it in production" story. It's about designing a system to fit constraints I didn't get to set, which is where the actual engineering, and most of what I learned, turned out to live. The stack underneath is React, TypeScript and Supabase, but the interesting parts had little to do with it.

## You inherit the identity system

The first constraint I ran into is that you don't get to choose how people authenticate. In a personal project you'd wire up email-and-password in an afternoon and move on. Here the requirement was fixed and non-negotiable: users authenticate with their institutional identity, the university-issued account they already hold, and nothing else. That single requirement ruled out the default path.

So authentication became two flows I had to build and keep coherent. Staff sign in through Microsoft via MSAL, against the organization's Azure AD tenant, so the app rides on the corporate identity the institution already manages. Students, who don't all sit in that directory, go through a custom one-time-code flow instead: you submit your university email, receive a short-lived six-digit code, and it's verified server-side before you're let in. Neither was the login I would have chosen. Both were the login the institution mandated. And that's most of the job when you build for someone else's organization. The identity system is something you inherit, not something you design.

## When you roll your own auth, you inherit everything downstream too

Here's the failure mode that cost me the most time, and the most transferable point in this post.

The database sits behind row-level security: every row carries policies deciding who may read or modify it, enforced by Postgres itself rather than trusted from the client. Those policies lean on a single assumption, that the database always knows who is asking. There's a canonical identity, exposed to every policy, that a predicate can reference. You write "a user can only touch rows they own" and it holds, because the ownership check resolves against a claim the database can read.

Except my students weren't authenticating through the standard provider. Because I'd built the custom code-based flow to satisfy the institutional-identity requirement, that canonical identity resolved to null, and every policy I'd written assuming it wouldn't started denying legitimate requests, comparing against nothing:

```sql
-- The tidy version assumes the canonical identity is always present:
--   using ( owner_email = auth_identity() )
-- With a custom auth flow, auth_identity() is null, so the predicate
-- denies everyone. You re-derive "who is asking" from the claim you
-- actually control, and fall back to it explicitly:
--   using ( owner_email = coalesce(auth_identity(), verified_claim()) )
```

The lesson outlives the fix. The moment you roll your own authentication, even for a legitimate reason like an institutional mandate, you also take on re-deriving everything that depended on the standard one. Every authorization check downstream that assumed the system knows who you are becomes yours to re-establish. Authentication is never just the login screen; it's the root that authorization, auditing and data access all hang from.

## The rules belong to the building, not to me

The same pattern surfaced in less technical places. A student can book up to three hours in daytime slots; staff get longer windows, later hours, and access to the large interactive rooms students can't reserve. There's an approval workflow, a graduated sanction system for repeated no-shows, and an audit trail of who did what. I didn't invent any of those limits. They encode how the university actually governs its spaces, and my job was to model them faithfully rather than editorialize. Building software for an institution is largely the work of translating an existing set of rules into something a system can enforce without losing the intent behind them.

Then there's the unglamorous surface that ends up mattering most. A confirmed booking writes a real event to an Outlook calendar through the Graph API; notifications go out over the university's own mail infrastructure so they clear spam filters; five locales, because the student body isn't monolingual. None of it is individually impressive, but together it's the line between a demo and something an institution will put its name on.

## What I took from it

If SAM taught me that the harness around a model is where the difficulty hides, LinceReservations taught me the same shape one level up. When you build for an institution, the interesting engineering isn't in the code you're free to write; it's in adapting cleanly to everything you're not free to change. The identity you inherit, the rules that aren't yours, the calendar that has to be the real one.

I won't overstate it. It isn't deployed, it was built by a single student, and I know exactly where I'd keep hardening it before real accounts ever existed, starting with the auth and abuse-protection work that deployment would demand. But whether or not the university adopts it, what I'm glad about is having designed the whole thing under constraints I didn't choose, and that ended up feeling more like real engineering than any project where I got to set the rules myself.
