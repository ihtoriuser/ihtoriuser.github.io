# AI agents in government services: interactive lesson

**Davlat xizmatlarida AI agentlar va ularning oddiy chatbotlardan farqi.** This is a 60-minute interactive presentation for government employees (Ustudy IT Academy, 12.10.2026). It is available in three languages: **O‘zbekcha · Русский · English**.

It is a **static website**. There is no server, database, API key or paid service: everything runs in the browser on synthetic data. Live site: **https://ihtoriuser.github.io/**

## Structure: 13 slides + appendix, 60 minutes

| # | Chapter | Slide | Min | → steps |
|---|---|---|---|---|
| 1 | Kirish | Introduction, lecturer, question for the room | 5 | |
| 2–4 | AI qanday ishlaydi? | AI ⊃ ML ⊃ DL ⊃ LLM + 3D network · training vs inference + temperature · tokens, embeddings, attention, hallucinations | 4+4+4 | |
| 5 | Huquqiy asoslar | Table of 5 verified acts with Lex.uz links | 5 | |
| 6–7 | Chatbot va agent | Architecture comparison + agent anatomy · **live agent demo** | 4+6 | 8 |
| 8–9 | Amaliy qo‘llanish | 7 use cases + “agent or automation?” · case study | 6+7 | 5 |
| 10 | Kelajak | Timeline: facts (with sources) and forecasts | 6 | |
| 11–12 | Etika | Dilemma · principles and the central idea | 4+3 | 3 |
| 13 | Xulosa | Three takeaways, question, “Rahmat!” | 2 | |
| + | Ilova | Sources and limitations | — | |

**How presenting works:** you press **→** (or a clicker), and that is all. Slides with steps (the agent demo, the case study, the dilemma) use the first presses to play their next step, then move on to the next slide. All other animations run by themselves. You can still click, but you never have to.

## Controls

| Key | Action |
|---|---|
| `→` `Space` `PageDown` | next step / slide (works with clickers) |
| `←` `PageUp` | back |
| `1`–`8` | jump to a chapter |
| `B` | hide or show the chapter panel |
| `T` | start / pause the timer (it also starts on the first →) |
| `F` | full screen |
| `N` | presenter notes for the current slide |
| `L` | switch language UZ → RU → EN |
| `R` | restart the current slide |
| `M` | turn animation off / on |

**Timers** (top bar):
- **Slide:** time on this slide against its plan. It turns amber at 80% and red when the plan is exceeded.
- **Total:** time against 60:00, plus how far ahead of or behind plan you are.

## Publishing on GitHub Pages (https://ihtoriuser.github.io/)

Repository: https://github.com/ihtoriuser/ihtoriuser.github.io. GitHub Pages serves the root of the `main` branch, so the built site is committed to the root (`index.html`, `assets/`, `favicon.png`, `.nojekyll`). The source sits alongside it: `app.html` (the entry point), `src/` and everything else.

To publish a change:

```bash
npm run publish
```

```bash
git add -A
```

```bash
git commit -m "Update lesson"
```

```bash
git push
```

The site updates within 1–2 minutes. `.gitignore` excludes `Content/` (CVs, the PDF), so private files are never published.

## Offline backup (if there's no internet at the venue)

```bash
npm run build:offline
```

Copy `dist-offline/` to a USB stick and **double-click `index.html`** — it opens without a server or internet connection. Only the external source links need internet.

## Development

```bash
npm install
```

```bash
npm run dev
```

The dev server opens `/app.html`. The root `index.html` is the last published build.

```bash
npm test
```

Browser test (with the dev server running): `npm run test:browser`. It opens every slide in 3 languages and at 3 sizes, checks for overflow and errors, and exercises keyboard navigation, the timers, the agent demo and the build steps. Environment variables: `PLAYWRIGHT_PATH`, `PW_CHANNEL=chrome`, `TEST_URL`.

## Where things live

```
src/content/data.js     slide order, minutes and steps; synthetic records; law, event and source data
src/i18n/uz|ru|en.js    all text in three languages (missing keys fall back to Uzbek)
src/slides/*.jsx        one component per slide
src/simulations/        engine.js (pure logic, tested) and AgentLab.jsx
src/app/App.jsx         shell: navigation, timers, panel, language, notes
src/styles/app.css      design: one accent colour per chapter
```

To change a slide's text, edit `src/i18n/*.js` (the same key in all three files). To change a slide's planned time, edit `minutes` in `data.js`; the minutes must add up to 60 (a test checks this).

Sources and how they were verified are in `docs/`.
