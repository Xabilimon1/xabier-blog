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

The company is an old industrial firm that maintains the exterior of more than 2,500 buildings across Spain. Not the first place you'd look for an agent in production, but that's where I built one. SAM is an orchestrator that sits on top of the company's Salesforce and answers real questions from two very different audiences: the sales team, from inside Salesforce, and the field operators, from a mobile app. One engine, two channels, real traffic.

I went in assuming the language model was the hard part. Prompt it well, choose the right one, and the rest is plumbing. It turned out to be closer to the opposite. In a system that touches a CRM holding real customer data, the model is maybe a fifth of the work and almost none of the risk. The other four fifths are how you route a request, how you scope what the agent is allowed to do, how you keep a tool call from turning into an injection, and how you find out something failed at 3am on a Sunday. That's the harness, and that's where the time went. I'll tell it as what I learned, not as advice, because most of it I only understood after getting it wrong.

## The one decision I got right early

The architecture was the one thing I designed deliberately before writing a single agent. The business was never going to want one agent. It would want a sales agent, then a field-ops one, then quotes, then compliance, then routing. If each of those meant touching the core, I'd be rewriting the engine every month.

So SAM isn't a collection of agents. It's a single engine that executes profiles, where a profile is a declarative list of steps, expressed as data rather than code:

```python
# A profile is data, not code. A new agent is a new entry here,
# and the engine that executes it stays untouched.
PROFILES = {
    "sales": [
        RagSearchStep(source="commercial"),
        LlmCallStep(stream=False),          # Salesforce expects a synchronous JSON response
    ],
    "field_ops": [
        LlmCallStep(stream=True, grounding=True),  # the mobile app consumes an SSE token stream
    ],
    # "quotes": [SfQueryStep(), PricingStep(), LlmCallStep(stream=False)],
    # ...one more list. The runner below never has to know.
}
```

The request path is deliberately boring: request, adapter, profile resolver, pipeline runner, steps, response. When the business asked for the second, third and fourth agent, each was a new list and a couple of new step implementations, never a change to the runner. The first time I shipped an agent in an afternoon instead of a week, the design paid for itself. The same structure absorbed the two channels too. Sales wants a single synchronous answer; field operators want tokens as they're generated. That entire difference lives in the adapter and one flag on the final step, instead of forking the codebase into a synchronous path and a streaming path.

## Then it hit me that every tool is a door

This is the part I hadn't anticipated. The moment your agent can act, query the CRM, resolve a contact, pull an opportunity, each of those tools is a door, and the caller walking through it is a model that can be steered into doing things it shouldn't.

I'm not a security engineer, and I won't narrate the specific holes I found and closed in a live client system, because that would be a strange thing to publish about someone else's production. But the disciplines I walked out with are worth writing down, precisely because none of them are clever. What looks like an exotic agent failure is usually one of these unglamorous controls missing. Tools are allow-listed per profile and the check fails closed, so the sales agent cannot invoke a field-ops tool, and authorization is decided server-side at call time, defaulting to deny. Anything that reaches the CRM goes through parameterized queries, never string-concatenated next to user input. And every tool call emits one audit line: timestamp, profile, tool, a hash of the arguments, and the outcome. A hash rather than the arguments themselves, so the audit log can't become the next place data leaks from. I arrived at most of these the slow way, by noticing after the fact that I'd trusted something I shouldn't have.

## The mistake that stuck with me

My favorite scar from this project is an operational one, because it's the cleanest "looks done, isn't" I've hit.

I configured an alert to page me if the system started returning too many rate-limit errors. It validated, it went green, and I moved on. It was not done. The metric I'd chosen measured a rate, errors per second, and I'd written the threshold as if it counted absolute errors. My rule effectively said "page me if we sustain more than ten rate-limit errors per second for five minutes", which is thousands of errors, which a real burst never produces. The alert was unfireable. It would have sat there reporting perfect health while the exact condition it was meant to catch played out underneath it.

I only caught it because I forced myself to fire a synthetic burst at the endpoint and wait for the page that was supposed to arrive. It didn't. Since then I don't trust an alert I haven't watched fire. Green on a dashboard only means nobody has proven it works yet.

That's the same lesson in miniature as one I keep relearning. Toward the end I stopped reviewing SAM's security by reading it myself, because I already believed it was fine, and belief is the one thing you can't audit with. I'd rather point something adversarial at the parts I've convinced myself are safe. It usually finds something.

## Why this points at research

If you'd asked me at the start where the difficulty in a production agent lives, I'd have pointed at the model. Now I'd point almost everywhere except the model: the routing, the tool permissions, the retry policy, the context you decide to keep or drop. And it isn't only my experience. There's a paper from Anthropic in early 2026 showing that infrastructure configuration alone can move agentic coding benchmarks by several points, sometimes more than the gap between the top models on the leaderboard. Reading it after living SAM felt less like a discovery than like a name for something my hands already knew.

The paper I'm trying to write now takes that seriously: how much each harness component actually contributes, ablated one at a time, on public models. SAM is where the question came from. It works, it's in production, it takes real traffic. But the part I'm proudest of isn't that it answers well. It's that when it breaks, it breaks somewhere I can see.
