---
title: Kymera
summary: A planned privacy browser that normalizes and poisons fingerprinting signals; so far the repo is two planning documents and no code.
period: "Apr 2026"
status: paused
tags: [JavaScript, C++, Git]
repo: https://github.com/Damilss/Kymera
---

Kymera is my plan for a privacy browser that hides a user's real persona by normalizing and poisoning the data fingerprinting scripts collect, so a machine reads as part of a common crowd instead of a unique device. The route I laid out starts as a Firefox extension and ends as a full Firefox fork. It is worth saying plainly up front: right now this is a roadmap and nothing else. The repository holds a README, a placeholder license file, a `.gitignore`, and two planning documents, and no source code has been committed.

## Where it stands

The four-year plan sets the technical thesis year by year. Year 1 is an extension that spoofs `navigator`, `screen`, canvas noise, and timezone, checked against coveryourtracks.eff.org, browserleaks.com, and amiunique.org, then persona profiles that let a user pick a common fingerprint to blend into and a report card UI showing which vectors are protected versus exposed. Year 2 is forking Firefox, getting it to compile locally, and going after the surfaces an extension cannot reach: TLS/JA3, font enumeration, audio context, WebGL. Year 3 is a stable, distributable, open-source build; Year 4 is a security audit, performance testing, cross-platform builds, and a written paper or thesis.

The month-one plan is the on-ramp, one week each: the browser rendering pipeline, how fingerprinting actually works, hands-on manipulation of the `navigator`, `screen`, and `Intl` APIs in the console, and finally a first extension that logs `navigator.userAgent` and then overrides it with a generic value.

```js
console.log(navigator.userAgent)
console.log(screen.width, screen.height)
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
```
*The only code anywhere in the repo: the week 3 console exercise, reading the exact attributes the extension is meant to spoof.*

Nothing past the planning has landed. The last commit is from 29 April 2026, and the next concrete step is still that week 4 extension overriding a single fingerprint attribute.

## Highlights

- Five commits total, on 28 and 29 April 2026; the tracked tree is five files and none of them is source code.
- One milestone per year: a published Firefox extension, a compiling Firefox fork with custom patches, an open-source release with users, and a distributable browser plus a paper or thesis.
- The design question the plan sets up for the fork stage is normalization versus randomization versus crowd-blending, with Tor Browser's anonymity-against-usability tradeoff as the reference point.
- Prior art named in the plan: Brave's fingerprinting work, Tor Browser, and academic defenses such as FPRandom and PriVaricator.
