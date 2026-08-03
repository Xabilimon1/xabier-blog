---
title: "From production to research, at 19"
excerpt: "I wanted to apply to a fellowship that requires a visa. I don't have one. What happened next was the most useful plan change I've made."
publishedAt: "2026-06-09"
category: "meta"
readingMinutes: 8
icon: "ph:compass-fill"
color: "coral"
lang: "en"
translationOf: "2026-06-09-de-produccion-a-research-a-los-19"
draft: false
---

A few days before the decision I was researching how to apply to Anthropic's fellowship, a company whose work fascinates me and whose ambition is similar to mine, a place where I see myself with full vocation. After reading the fine print came the punch: I couldn't apply because I don't have a full-time work visa for the US, Canada or the UK, so I was out of the running before I'd even started.

I sat down to think about what other places there were, but after a while I realized the interesting question wasn't that one. The question was what I was actually offering.

I'd describe myself as sharp and ambitious, not gifted nor any kind of high-capacity kid, but someone who fends for himself and who got lucky finding his calling early. I'm one of those weirdos who, as a kid, instead of just playing, spent his time figuring out how to play better. The kid making mods in Minecraft, plugins, always seeing one more way to improve and never finding "good enough". When something got into my head I'd comb through all of YouTube, the entire Google index, the whole thing, until every link turned purple and every video showed as watched. I devoured information like a hungry bear.

I'm getting sidetracked. Back to the question of what I had to offer. When I did the honest inventory, this came out.

I've been working for a while now at a long-running industrial company that maintains the exterior of more than 2,500 buildings across Spain. The interesting part is that right there, in a company you wouldn't first associate with AI, I built SAM: a commercial orchestrator agent on top of Salesforce that enriches the contact context, hands it to our backend, and returns answers via Gemini. It takes real traffic from both the Salesforce app and the mobile app. It's the closest thing I have to "real production agent", and the list of things I learned there about how multi-agent systems break silently is where the raw material for the paper I'm going to write comes from.

I also work as an intern at my university. I built there an evaluation interface for projects used by some 30-40 professors a year, course after course. Not a proof of concept — institutional production with everything that implies: calendars, identities, dates you can't move. I also built a study-room reservation system for the university's students. It's designed for real institutional use, though it hasn't been deployed yet; they're still deciding whether to roll it out.

On my own I work on Numo, a desktop app that aims to replace SPSS and modernize the experience of doing statistics. The idea: a real, local statistics engine bundled with the app (pandas, scipy, statsmodels, pingouin) plus natural-language interpretation via Claude. The argument that can't be copied: your clinical or educational data never leaves your computer, only the AI needs internet, not the data. Still in development, no users yet, but the architecture is in place on Tauri v2 and the engine's algorithms work.

Four real things, which said like that sounds fine. But if you sit in the chair of a recruiter at one of those labs, what they see is a builder, top 5% of kids his age, sure, but builder credibility is exactly the thing those places already have stacked to the ceiling. What I didn't have was a single published paper, not a single replication, not a single contribution to research that travels between labs.

And the thing is that research signal travels. A paper with my name on it reads the same at Anthropic, OpenAI, DeepMind, Mistral, or any AI startup, and an open-source tool built around one particular assistant only travels toward that assistant.

So the problem wasn't doing more things in production, it was publishing the knowledge I already have from the place this stuff is actually learned, which is production breaking from places you didn't expect.

Before accepting this I went for the classic move, the one your gut asks for when you've been building things for two years: a big, ambitious open-source flagship that says "this is the guy". I went through three ideas. All three died from deeper research the same afternoon, in about four hours.

The first was a benchmark for how LLM agents recover from cascading failures: timeouts, broken tools, truncated context. My initial read was that nobody was doing this seriously. Once I started searching properly, up came Letta Recovery-Bench, balagan-agent, ToolMisuseBench and a couple more, several of them with institutional backing. I dropped that one right there.

The second was a cost and cache profiler for production agent runs. My initial read was that this is exactly what bit me in production and therefore everyone would want it. Once I started searching I found more than 10 active OSS projects and, on top of that, the team behind the assistant I'd be profiling shipped a native `/cost` command in their CLI that same week. That made two.

The third was "agent-surgeon": fork, merge and replay of agent sessions for post-mortem debugging. My initial read was that this one was new, that this was the good one. Once I started searching it turned out the SDK already exposed hooks for forking, listing and resuming sessions with an official cookbook, and there was a competitor with hundreds of stars on GitHub (`es617/claude-replay`) already doing HTML replays of agent sessions. That was the third one gone.

The feeling of dropping three ideas in a row in a single afternoon is rough, because every time you kill one you realize you were one click away from building it without having done the homework, and I would have lost months either reproducing what already exists or chasing parity with a team that ships weekly.

What I actually took away from that afternoon wasn't any of the ideas, it was the realization that I can't trust the first search when I'm deciding where to put a year and a half of my life. Minimum three pulls across different places — GitHub direct, arxiv, the forums where the people actually building this stuff hang out — with different synonyms in each, before telling myself something doesn't exist. The broader conclusion: the open-source space around assistants is saturated in 2026, and betting 18 months of solo dev there is a losing bet.

From there the plan reshuffled, and the centerpiece is writing an empirical paper that answers one concrete question: how much does each harness component (prompt structure, tool selection logic, retry policy, context management) contribute to LLM agent performance? Systematic ablation, public models, synthetic tasks, multiple trials. It cites and extends a recent Anthropic paper (February 2026) showing that infrastructure configuration can move agentic coding benchmarks by several percentage points — sometimes more than the gap between the top leaderboard models. I extend that empirically to the rest of the harness components. Solo, public APIs, around 300 dollars of compute. No third parties involved. If the top workshop doesn't accept it, it goes to arxiv as a preprint and I move on.

In parallel I'm staying with the degree, with the company and the university, and I'm opening this blog as a place to deposit what I'm learning. Not as a "personal brand" strategy. For the boring reason that writing what I study is the only way I know whether I actually understand it.

I don't know if the paper will land. The question is good, the methodology is defensible, but submitting a paper to a workshop at 20 is not trivial and the rejection rate is real. I also don't know whether the 18 months I've given myself is the right number. Could be less is enough. Could be I need more.

And the doubt that's hardest to say out loud: is this the right path, or the rationalization of not being able to do the fellowship because of the visa? Honestly, I don't fully know. What I do know is that research signal travels between labs, that the builder part I already have covered, and that killing three flagships in one afternoon taught me that speed without verification is what costs you the most.

With what I know today, this is my best bet. I have no certainty whatsoever that it's the right path, and I'll be writing about it here as I play it out.
