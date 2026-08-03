---
title: "SAM: the hard part was never the model"
excerpt: "I built an agent that's in production over a CRM, taking real traffic from two channels. I went in thinking the model was the hard part. Two years later I'd point almost anywhere else."
publishedAt: "2026-08-03"
category: "production"
readingMinutes: 6
icon: "ph:circuitry-fill"
color: "purple"
lang: "en"
translationOf: "2026-08-03-sam-el-modelo-nunca-fue-lo-dificil"
draft: false
keywords:
  - "LLM agents"
  - "production agents"
  - "agent architecture"
  - "agent harness"
  - "Salesforce"
  - "Vertex AI"
---

I wrote a while back that what pushed me from building toward research was watching production break in ways the model was never responsible for. This is the longer version of that sentence, told through SAM, an agent I built for a Spanish industrial company.

The company is an old industrial firm that maintains the exterior of more than 2,500 buildings across Spain. Not the first place you'd look for an agent in production, but that's where I built one. SAM sits on top of the company's Salesforce and answers real questions from two very different audiences: the sales team, from inside Salesforce, and the field operators, from a mobile app. Same brain, two channels, real traffic.

I went into it assuming the language model was the hard part. Prompt it well, pick the right one, and the rest is plumbing. It turned out to be almost the opposite. In a system that touches a CRM with real customer data, the model is maybe a fifth of the work and almost none of the risk. The other four fifths are how you route a request, what you let the agent actually do, how you stop a tool call from turning into an injection, and how you find out something broke at 3am on a Sunday. That's the harness, and that's where I spent my time. I'm going to tell it as what I learned, not as advice, because most of it I only understood by getting it wrong first.

## The one decision I got right early

The architecture I did think about before writing a single agent. The business was never going to want one agent. It was going to want a sales one, then a field-ops one, then quotes, then compliance, then routes. If every one of those meant touching the core, I'd be rewriting the engine every month.

So SAM isn't a pile of agents. It's a single engine that runs profiles, and a profile is just a list of steps declared as data:

```python
# A profile is data, not code. A new agent is a new entry here,
# and the engine that runs it doesn't change.
PROFILES = {
    "sales": [
        RagSearchStep(source="commercial"),
        LlmCallStep(stream=False),          # Salesforce wants one synchronous JSON reply
    ],
    "field_ops": [
        LlmCallStep(stream=True, grounding=True),  # the mobile app streams tokens over SSE
    ],
    # "quotes": [SfQueryStep(), PricingStep(), LlmCallStep(stream=False)],
    # ...one more list. The runner below never finds out.
}
```

The request flow is deliberately boring: request, adapter, profile resolver, pipeline runner, steps, response. When the business asked for the second, third and fourth agent, each one was a new list and a couple of new steps, never a change to the runner. The first time I added an agent in an afternoon instead of a week, I understood why I'd bothered. The same shape quietly solved the two channels too. Sales wants one synchronous answer, field operators want tokens streaming as they come, and that whole difference lives in the adapter and one flag on the last step, instead of forking the codebase into a sync half and a streaming half.

## Then it hit me that every tool is a door

This is the part I hadn't seen coming. The moment your agent can do things, query the CRM, look up a contact, pull an opportunity, each of those tools is a door, and the thing walking through it is a model that can be talked into stuff.

I'm not a security engineer, and I'm not going to narrate the specific holes I found and closed in a live client system, because that would be a strange thing to publish about someone else's production. But the habits I walked out with are worth writing down, mostly because none of them are clever, and that's kind of the point. What looks like exotic agent failure is usually one of these boring things not being in place. Tools are allow-listed per profile and the check fails closed, so the sales agent simply cannot call a field-ops tool, and "is this allowed?" is decided on the server at call time, defaulting to no. Anything that reaches the CRM is parameterized, never string-glued next to user input. And every tool call leaves one audit line: when, which profile, which tool, a hash of the arguments, the outcome. A hash and not the arguments themselves, because the log can't become the next place data leaks from. I got to most of these the slow way, by realizing after the fact that I'd trusted something I shouldn't have.

## The mistake that stuck with me

My favorite scar from this project is an ops one, because it's the cleanest "looks done, isn't" I've hit.

I set up an alert to page me if the system started throwing too many rate-limit errors. Configured it, it validated, went green. Done, I thought. It was not done. The metric I'd used measured a rate, errors per second, and I'd written the threshold as if it counted total errors. My rule effectively said "fire if we sustain more than ten rate-limit errors per second for five minutes", which is thousands, which never happens from a real burst. The alert was unfireable. It would have sat there looking perfectly healthy while the exact thing it was meant to catch happened underneath it.

I only caught it because I forced myself to fire a fake burst at the endpoint and wait for the page that was supposed to come. It didn't. Ever since, I don't trust an alert I haven't actually watched go off. Green on a dashboard just means nobody has proven it works yet.

That's the same lesson in a smaller form as something I keep relearning. Toward the end I stopped reviewing SAM's security by reading it myself, because I already believed it was fine, and belief is the one thing you can't audit with. I'd rather have something adversarial go looking for the thing I've convinced myself isn't there. It usually finds it.

## Why this points at research

If you'd asked me at the start where the difficulty in a production agent lives, I'd have pointed at the model. Now I'd point almost everywhere except the model: the routing, the tool permissions, the retries, the context you keep or drop. And it's not just my anecdote. There's a paper from Anthropic in early 2026 showing that infrastructure configuration alone can move agentic coding benchmarks by several points, sometimes more than the gap between the top models on the leaderboard. Reading it after living SAM felt less like a discovery and more like a name for something my hands already knew.

The paper I'm trying to write now takes that seriously: how much each harness component actually contributes, ablated one at a time, on public models. SAM is where the question came from. It works, it's in production, it takes real traffic. But the part I'm proudest of isn't that it answers well. It's that when it breaks, it breaks somewhere I can see.
