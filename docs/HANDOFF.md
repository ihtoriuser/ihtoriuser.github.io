# Technical handoff (2026-10-11)

## Round 5: exact title and lesson order
- **Exact topic name** everywhere (title, sidebar, intro): “Davlat xizmatlarida AI Agentlar (AI Agents) va ularning oddiy Chatbotlardan farqi”. In RU and EN the intro also shows a translation under it.
- **New order** (`SLIDES` in `data.js`): AI basics → AI history (moved into chapter 2 as the bridge to agents) → chatbot vs agent → use cases → law → 2031/2036 → ethics → conclusion. Timing is still 60 minutes.
- **Notes:** the presenter notes no longer hard-code minute ranges; the notes dialog computes them from the slide order.
- **Speaker script (RU):** written as a Claude doc, “Текст выступления — …”.

## Round 4: AI timeline 2021 → 2036
- The old `Future.jsx` (two slides) is replaced by three slides:
  - `AiHistory.jsx` (`timeline`): overview → 2021 … 2026 → TODAY, 7 build steps;
  - `FutureScenarios.jsx` (`future2031`, `future2036`): baseline → cautious → accelerated, 2 build steps each.
- Chapter 6 still totals 6 minutes.
- Data lives in `src/content/aiTimeline.js`:
  - milestones with date, organisation, category, status and sources;
  - evidence;
  - scenarios;
  - illustration parameters;
  - forecast themes with evidence level.
- Text lives in `src/i18n/timeline/{uz,ru,en}.js` and is merged into `t.tl` by `getT()`.
- **Interactions:**
  - the year navigator 2021 → 2036 is shared across all three slides;
  - category filters; clickable and keyboard-focusable milestones on the "river";
  - a detail panel (what happened / what changed / why it matters / public service);
  - a sources panel (Esc closes it);
  - scenario selector; cycling theme cards with assumption and obstacle; overview reset.
- **Tests:** `engine.test.mjs` checks that milestones are chronological, before the reference date and sourced, and that the text is complete in all three languages. The browser test exercises the timeline's steps, filters, sources, scenarios and year navigation.
- The factual audit is in `docs/timeline-audit.md`.

## Round 3 (author feedback)
- **Navigation:** a “Boshiga / В начало / To start” button (and `Home`) jumps to slide 1. The start, back and next buttons now sit together on the right of the footer.
- **Avatar:** `Content/ava.jpg` was cropped to a face square and saved as `public/ava.jpg`. It appears in the intro presenter card and on the final “Rahmat!” card.
- **Larger type** everywhere (base `--fs-body` is now 15–20 px; tables, captions and labels raised). The short-screen rules no longer shrink text below 15 px.
- **Neural network:** the 3D model and the `three` dependency were removed. `slides/Network.jsx` shows concrete inputs (3 text features of a citizen request, 0/1), 4 hidden ReLU neurons and 3 output categories with softmax %. The forward pass is real. 4 examples cycle automatically; the mixed example shows low confidence, so the case goes to an officer.
- **Future, split in two:**
  - `timeline`: years from left to right, with 2024 split into two half-year columns; each card has a date, title, short text and source; “today” sits at the end.
  - `future`: three columns — today (facts with sources), +5 years and +10 years (forecast, visually distinct) — plus “what does not change”.
- **Split slides** (so everything fits): AI map | network; tokens | attention; law (data & strategy) | lawAi (AI rules + takeaways); agents | anatomy; timeline | future. That gives 18 lesson slides and still 60 minutes.
- **Fit check:** at 1920×1080 and 1366×768, all slides in UZ, RU and EN fit; the worst case scrolls about 12 px.

## Round 2: restructured as a presenter-first slide deck (current)

Requested by the author: deploy as a static site to GitHub Pages; remove the PDF and use a law table instead; add a timer per slide; make the chapter panel collapsible; reduce how much has to be clicked ("show it visually and move on" — interactivity is kept but optional); fewer sub-chapters, with each slide self-contained and including its text; add Russian and English.

### What changed
- **13 slides + appendix** (was 23 scenes). Each slide carries its full explanatory text. The registry, with minutes and build steps, is in `src/content/data.js` (`SLIDES`).
- **→ drives everything.** Slides can claim "→" presses through `ctl.current.advance()`:
  - agent demo: 8 presses, one per agent step; at the approval gate → approves;
  - case study: 5 steps;
  - dilemma: 3 reveals.
  Going back to a slide with steps shows it fully built. Elsewhere, animations cycle by themselves (`useCycle`), and a manual hover or click pauses the cycle for 15 s.
- **Timers:** the per-slide timer (planned minutes, amber at 80%, red when over), the total against 60:00, and the plan deviation. The clock starts on the first →. `T` toggles it.
- **Chapter panel:** collapses with `B` or the menu button, remembers its state, and becomes an overlay on mobile.
- **Languages:** `src/i18n/{uz,ru,en}.js` hold the same shape. Russian and English deep-merge over Uzbek, so a missing key never crashes. A unit test asserts that every slide, law, event, theme and use case has text in all three. Manrope now ships its Cyrillic subset. Language is chosen with `?lang=`, the switch, or `L`, and is remembered.
- **Law table** replaces the PDF viewer. `public/documents/ai-law-uzbekistan.pdf` (a copy) was deleted, and no PDF is published. The original stays in `Content/` (git-ignored). Russian and English titles are the author's translations; the law numbers are localised (ZRU/ЗРУ, PP/ПП).
- **Engine** is now language-neutral: errors are codes, drafts are data, and synthetic records use category and department codes. RAG retrieval and the decision-aid helpers were removed together with their screens.
- **Deployment:**
  - GitHub Pages serves the root of `main`. `npm run publish` builds the site and copies it to the root (`index.html`, `assets/`, `.nojekyll`). The source entry point is `app.html`.
  - `npm run build:offline` → `dist-offline/` uses one IIFE classic script, so `index.html` opens by double-click from `file://` (verified in Chrome: styles, fonts and the 3D canvas all render).
- **Fixed during this round:** the URL update had put the query string after the hash (`#2?lang=uz`).
- **Removed files:** `src/scenes/*`, `src/simulations/LearningLab.jsx`, `MeaningLab.jsx`, `src/components/UI.jsx`, `src/content/{lesson.js,legal.json,news.json}`, `src/styles/{main,scenes}.css`. Their content was migrated into `data.js`, `i18n/*` and `slides/*`.

### Verification (last run)
- `npm test`: 8/8 pass, including 60-minute timing and full 3-language coverage.
- `npm run build` and `npm run build:offline` both succeed.
- Browser suite: 70 renders in total (14 slides × UZ at 1920/1366/390, plus RU and EN at 1920). Results: 0 console errors, 0 horizontal overflow, and all keyboard, timer, agent, build-step and reduced-motion checks pass.
- Fit without scrolling: at 1920×1080, all 13 lesson slides fit in all three languages, except Future in RU (about 20 px). At 1366×768 with the panel hidden, all UZ slides fit within about 10 px; RU Future scrolls about 70 px.

## Round 1 (earlier the same day)
I continued the Codex build and added:
- 8-stage agent lab with a dynamic tool choice;
- agent anatomy, tokens/embeddings/attention, the training loss curve and temperature;
- use cases with the case-study architecture;
- the verified 11-event timeline;
- the multi-step ethics dilemma.

Bug fixed: the lecture timer lost increments. See `AUDIT.md` for the state before that work.

## Unresolved / unverified
- **OpenAI Operator:** openai.com returned 403 to automated fetching. The date (2025-01-23) comes from search results that quote OpenAI's page. Open it once before the lecture.
- **Not re-checked in round 2:** OpenAI Frontier and the five legal acts were verified by Codex and in round 1, not again.
- **Russian and English law titles** are translations, not official texts. Lex.uz Russian pages may themselves be unofficial translations (noted on the slide).
- **Qualitative teaching aids:** the ethics meters, the gap chart, the embedding map and the attention vectors are labelled as such.
- **Published** to https://github.com/ihtoriuser/ihtoriuser.github.io. The previous project there (MTS Studio 201) was replaced by an ordinary commit and stays in the Git history.
- **Projector hardware** was not tested; only browser viewports were.
