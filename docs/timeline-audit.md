# AI timeline 2021 → 2036: factual audit (11.10.2026)

Reference date: **11.10.2026**, the date of the lecture. Data: `src/content/aiTimeline.js`. Text: `src/i18n/timeline/{uz,ru,en}.js`.

## How the facts were checked

- **Primary source read:** every historical milestone has a primary source.
  - Pages read directly: Google Gemini 1.0, Google I/O 2026, the Claude 3.7 / Claude Code announcement, DeepSeek-R1, the METR TH1.1 blog, Stanford AI Index 2026, the International AI Safety Report 2026, OpenAI's Deployment Safety page (GPT-6, October), the AlphaFold DB announcement and Stable Diffusion.
  - openai.com pages block automated reading (HTTP 403). For those, dates and status were confirmed through search results that quote the OpenAI pages, plus independent press: CNBC for GPT-6 Astra, 9to5Mac for Intelligent UI.
- **Links:** all 30 source URLs returned HTTP 200 on 11.10.2026.
- **Status:** each event carries a status label, so a research announcement, preview, limited access, beta, general release, open weights, a law in force, an award and a report are never shown as the same kind of event.

## Corrections compared with the previous version and the candidate list

| Item | What changed |
|---|---|
| Previous timeline (11 events) | Replaced with 24 milestones, each with category, organisation, status and source. Removed: UNESCO 2021, NIST AI RMF and Frontier, which are general background; NIST and UNESCO remain in the evidence/ethics context. |
| Gemma 4 12B (06.2026) | Removed from the milestones to keep the list within 25; DeepSeek-R1 represents open weights. |
| Google I/O 2026 | Dated **20.05.2026** (Google's own announcement post; one press source gives 19.05). Gemini Spark is marked as limited early testing, not a release. |
| GPT-6 Astra (03.09.2026) | Marked as **limited access / phased rollout**: cybersecurity programme participants first, general release reported for 04.09. |
| “GPT-6 and Intelligent UI, 07.10.2026” | Precisely: **GPT-6 Sol (paid) and Luna (free) arrived in ChatGPT**. Intelligent UI is attested by 9to5Mac; OpenAI's Deployment Safety page confirms the models and date but does not mention Intelligent UI. |
| ChatGPT (30.11.2022) | Shown as a *research preview*, as it was at launch. |
| ChatGPT Plugins (23.03.2023) | Shown as *limited access* (alpha with a waitlist). |
| o1 (12.09.2024) | *o1-preview*, not the full o1 release. |
| Claude Code (24.02.2025) | *Limited research preview*. |
| Sora (15.02.2024) | Not included: it was only a research announcement, and the list had to stay at 18–25 items. |
| Llama 2, Codex agent, Agents SDK, Gemini 3 | Not included to keep the list within 25; their capabilities are represented by DeepSeek-R1 (open weights), Claude Code (agentic coding) and ChatGPT agent (agents). |
| METR, Stanford AI Index 2026 | Moved from the milestones into **observed trends** (the TODAY step), as evidence for the forecasts. The METR caveat is stated explicitly: time horizon is measured in human working time on benchmark tasks, which is not the same as hours of autonomous work. |
| AlphaFold DB (22.07.2021) | The DeepMind page header now shows 22.07.2022 because of a later update label, but the text describes the July 2021 release. Kept as **2021**. |
| Added | AlphaFold Nobel Prize (09.10.2024), O‘RQ-1115 (21.01.2026), International AI Safety Report 2026 (03.02.2026). |

## Future (2031, 2036)

- **Labelled as forecasts:** shown under a separate banner (“KELAJAK PROGNOZLARI — BU ANIQLANGAN FAKTLAR EMAS”).
  - 2031 cards are labelled *Prognoz*.
  - 2036 cards are labelled *Taxminiy imkoniyat*.
  - Every card has an assumption (*Faraz*) and a main obstacle (*Xavf yoki cheklov*).
  - An evidence-level scale runs: observed trend → extrapolation → scenario → speculation.
- **Scenarios:** three — cautious, baseline and accelerated. No probabilities or invented numbers. Switching scenarios changes the cards, the summary, the benefits and risks, the branching path and the illustration.
- **AGI card:** states that there is no agreed definition or timetable for AGI, that capability, adoption and legal permission are different things, and that superintelligence is not a 2036 prediction.
- **Forecast numbers:** none. The only figures are attributed observations: AI Index (OSWorld 12% → ~66%, incidents 233 → 362) and METR (doubling roughly every 4–7 months depending on the period).

## Uncertain or not independently verified

- The details of OpenAI's own GPT-6 Astra page (403) were read only through quotes and CNBC.
- Intelligent UI comes from a secondary source (9to5Mac).
- METR and AI Index figures are reported as written in their sources; I did not re-calculate them.
