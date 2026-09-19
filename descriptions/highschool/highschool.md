---
title: High School Project Site
summary: A static site I hand-wrote in high school collecting AP CS, AI, engineering, and architecture coursework across four pages.
period: "Nov 2023 – Feb 2026"
status: archived
tags: [HTML, CSS, JavaScript, p5.js]
repo: https://github.com/Damilss/ap-cs-project-site
live: https://damilss.github.io/ap-cs-project-site/app/index.html
---

The oldest thing in this portfolio: a project site I hand-wrote in high school
and deployed on GitHub Pages. Four content pages hang off a hand-typed nav bar,
plus an about page and one detail sub-page. Every entry is the same repeated
block of markup — image, heading, link out, paragraph — and there is no build
step and no npm dependencies.

![A Mad Libs project from the AP Computer Science page](/work-assets/highschool/madlibs.jpg)

## What's on it

- **AP Computer Science** — two Scratch games: an [Angry Birds / Flappy Bird
  mashup](https://scratch.mit.edu/projects/882368710/) where the pigs attack the
  building behind the bird and speed up as you go, and an [interactive Mad
  Libs](https://scratch.mit.edu/projects/882560927/).
- **AI** — a webcam classifier that labels whether you are holding keys, a
  phone, or a watch.
- **Engineering and Architecture** — a Lego pool-house on wheels, a sub-1000
  sq ft Cedreo house design, a SketchUp assignment covering eight roof styles,
  and an initial keychain modeled in TinkerCAD and printed in PLA.
- **Adv. Engineering and Design** — Fusion 360 tutorial parts, a cardboard
  bridge pinned with 3D-printed corkscrew nails that carried around 66 lbs, a
  KidWind turbine-blade competition entry, and a UC Berkeley BioEHSC entry.
- **BioEHSC detail page** — a PLA bioplastic from banana waste: lactic acid
  fermentation with two *Aspergillus* fungi, then ring-opening polymerization
  over a zinc-oxide-nanoparticle catalyst. Five of us worked on it for seven
  weeks; I drafted the team video and checked each piece for errors.

## The one page that runs anything

The AI page pulls p5.js and ml5.js from a CDN, loads a Teachable Machine model
in `preload()`, and starts the webcam. Classification is two functions calling
each other: `classifyVideo()` hands a flipped frame to the classifier, and
`gotResult()` takes the top label and asks for the next frame.

```javascript
// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}
```

*The recursion that keeps the label updating: every result requests another.*

## Where it stands

I have left the pages as they were written. The one real change since is a
December 2025 cleanup that moved the pages and stylesheets into `app/` and
deleted the leftover Replit config, which is why the bare GitHub Pages URL now
renders the README through Jekyll and the link above points at `app/index.html`.
The rough edges are still there, and I would rather leave them than quietly
patch them: `app/geniusHour.html` is a 0-byte file nothing links to, two nav
bars send "Adv engineering and design" to the wrong target, and one BioEHSC
image is requested at the wrong relative depth, so it 404s. The README dates the
work to 2022, but the first commit is November 2023 and pages were still being
added through May 2025, so the dates above are the ones the history shows.
