# Project audit (2026-10-11, before continuation)

Internal audit written when continuing the Codex implementation.

## Existing architecture
- Vite 7 + React 19 SPA, Three.js 0.180 (lazy-loaded chunk), Manrope via @fontsource. `base: './'` → static hosting works from any sub-path.
- `src/app/App.jsx` — shell: sidebar, topbar (mode switch, timer, motion toggle, fullscreen), scene tabs, footer progress, instructor-notes `<dialog>`, hash routing `#chapter-tab`, error boundary per scene.
- `src/content/*` — chapters/notes (`lesson.js`), verified legal cards (`legal.json`), news + science sources (`news.json`).
- `src/scenes/*` — one component per lecture section; `src/simulations/*` — agent lab, training/token labs, pure `engine.js` (unit-tested).
- `src/visualizations/NeuralNetwork.jsx` — Three.js scene with disposal, ResizeObserver, SVG fallback.
- Tests: `tests/engine.test.mjs` (node:test, 7 passing); `tests/browser-smoke.cjs` (Playwright, depends on Codex runtime path).
- Docs: `docs/legal-verification.md`, `docs/science-sources.md`, `docs/source-audit.md`.

## Completed (working)
- All 8 sections exist and render; navigation, keyboard ←/→/Space, hash deep links, timer, fullscreen, reduced-motion toggle, notes dialog.
- Legal section: timeline + detail card with norm vs. interpretation split, Lex.uz links, embedded local PDF (byte copy in `public/documents`).
- 3D network (rotate/zoom/reset, SVG fallback), training sim (real softmax + cross-entropy gradient), token/temperature sim, AI map, hallucination scene.
- Agent lab (7 steps, permission toggle, approve/reject, data + tool-call inspector), appeal workflow, keyword RAG, permission quiz, ethics dilemma, conclusion with reflection and sources page.
- `npm run build` and `npm test` pass; no console errors except a missing favicon (404).

## Incomplete / missing content
- Section 2: no embeddings or Transformer/attention explanation; neural network shows no actual computation (weighted sum → activation); temperature slider never drives an actual sample.
- Section 4: no explanation of tool calling, planning, state/memory, orchestration, observation, agent loop, HITL as concepts. Agent lab is a fixed linear script — it does not show *agent-directed* decisions vs. a predetermined workflow; chatbot side is static; no autoplay/pause; 7 stages vs. requested 8.
- Section 5: no overview of government use cases (classification, drafting, knowledge assistant, service support…); no "agent vs. deterministic automation" decision aid; appeal case lacks an architecture view (tools/API/data/approval).
- Section 6: only 4 news items; themes requested (long-running workflows, reliability & safety, human-AI collaboration) missing; no capability vs. prediction distinction beyond text.
- Section 7: dilemma is a single click with no consequences over time; principles list covers 4 of the 7 requested topics and is static.
- No README / run / deploy instructions; no keyboard shortcuts for fullscreen, notes, section jumps.

## Visual / UX problems
- Palette is muted green/cream across every section; sections lack individual identity (brief asks for vivid, documentary-like visuals).
- Neural network occupies a small part of a large dark stage; several scenes are text-heavy with little explanatory illustration.
- Code is written in minified one-line style, which makes maintenance hard (left as-is where unchanged).

## Build & runtime
- No build/runtime errors. `favicon.ico` 404. Browser smoke test hard-codes a Codex-only Playwright path (made overridable).

## Prioritised tasks
1. P0: favicon; keep build/tests green.
2. P1: Agent lab rewrite (8 stages, dynamic tool choice, workflow comparison, tool-call log, per-item approval, autoplay); agent anatomy scene.
3. P1: Section 2 — embeddings + attention scene, neuron computation panel, auto-training with loss curve, temperature-driven sampling.
4. P1: Section 5 — use-case explorer + "agent or automation?" decision aid; architecture diagram for the appeal case.
5. P1: Section 6 — verified timeline of 7 themes, demonstrated vs. forecast labels.
6. P1: Section 7 — multi-stage dilemma with consequences; 7 interactive principles.
7. P2: per-section accent colours, presenter shortcuts, layout checks at 1920/1366/390.
8. Docs: README, handoff, unresolved claims.
