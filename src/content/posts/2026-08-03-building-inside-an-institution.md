---
title: "Lince: the constraints you don't get to choose"
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

The other case study I wrote here was about an agent, and the lesson was that the model was never the hard part. This one is about a much more ordinary piece of software, a web app for booking study rooms, and the lesson rhymes. The framework was never the hard part either. What made it hard was that I was building it for an institution, and an institution has already decided most of the things you'd normally get to design yourself.

The app is Lince, a study-room reservation platform I built for my university's study spaces. I want to be honest about its status right at the top, because it changes how you should read the rest. It isn't deployed. I built it as a complete product, with auth, roles, an admin side, calendar integration and five languages, all against the university's real requirements, and right now they're deciding whether to actually roll it out. So this isn't a "we run on it" story. It's the story of designing something to fit constraints I didn't get to set, which turned out to be the whole difficulty and most of what I learned. There's React, TypeScript and Supabase underneath, but the interesting parts had nothing to do with the stack.

## You inherit the identity system

The first thing I found out is that you don't get to choose how people log in. In a side project you'd wire up email and password in an afternoon and move on. Here the rule was simple and there was no arguing with it: people would authenticate with their institutional email, the university account they already have, and nothing else. That one sentence quietly killed the easy path.

So authentication became two paths I had to build and keep working together. Staff sign in through Microsoft, the same corporate identity they use for everything else, so the app leans on the account the institution already manages. Students, who don't all have that same setup, go through a one-time-code flow instead: you type your university email, you get a short-lived six-digit code, you type it back, you're in. Neither of those was the login I would have picked. Both were the login the institution required. And that's most of the job when you build for someone else's building. The identity system is something you inherit, not something you invent.

## When you roll your own auth, you inherit everything downstream too

Here is the part that actually caught me out, and I think it's the most useful thing in this whole post.

The database sits behind row-level security. Every row carries rules about who is allowed to see or change it, and the database itself enforces them instead of trusting the app to. The clean way those rules work is that the database always knows who is asking. There's a standard identity that every policy can lean on. You write a rule that says "you can only touch rows that are yours", and it works, because "you" is something the database can read.

Except my students weren't logging in the standard way. Because I'd built that custom code-based flow to satisfy the institutional-email rule, the database's usual notion of who is asking came back empty. And every rule I'd written assuming it wouldn't be empty started failing, silently, denying legitimate actions because the check was comparing against nothing:

```sql
-- The tidy version assumes the standard identity is always there:
--   using ( owner_email = current_identity() )
-- With a custom login, current_identity() is null, so the rule
-- denies everyone. You end up re-deriving "who is asking" from the
-- claim you actually control:
--   using ( owner_email = coalesce(current_identity(), my_own_claim()) )
```

The lesson is bigger than the fix. The moment you roll your own authentication, even for a good reason like an institution telling you to, you also sign up to re-derive every single thing that depended on the normal one. Every check downstream that assumed the system knows who you are is now yours to satisfy again. Auth is never just the login screen. It's the root that a hundred other decisions hang off.

## The rules belong to the building, not to me

The same thing kept showing up in less technical places. A student can book for up to three hours, in daytime slots. Staff get longer, and later, and access to the big interactive rooms students can't touch. There's an approval flow, a way to sanction people who keep no-showing, an audit trail of who did what. I didn't invent any of those numbers or rules. They mirror how the university actually runs its spaces, and my job was to model them faithfully, not to have opinions about them. Building software for an institution is mostly the work of turning someone else's existing rules into something a computer can enforce without losing whatever made them make sense.

And then there's the boring surface that turns out to matter most. A confirmed booking creates a real event in an Outlook calendar. Emails are meant to go out through the university's own mail system so they don't land in spam. Five languages, because the students aren't all going to read Spanish. None of that is impressive on its own, but together it's the difference between a demo and something an institution could put its name on.

## What I took from it

If SAM taught me that the harness around a model is where the difficulty hides, Lince taught me the same shape one level up. When you build for an institution, the interesting engineering isn't in the code you're free to write, it's in adapting cleanly to everything you're not free to change. The identity you inherit, the rules that aren't yours, the calendar that has to be the real one.

I'm not going to pretend it's more than it is. It's not deployed, it's built by one student, and I know exactly where I'd keep hardening it before real people ever touched it. Whether the university adopts it or not, the part I'm glad about is that I designed the whole thing under conditions I didn't get to choose, and that ended up feeling more like real engineering than any project where I set the rules myself.
