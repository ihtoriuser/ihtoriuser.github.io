/* Language-neutral data. All visible text lives in src/i18n/*.js, keyed by the ids below. */

// Slide registry. `minutes` drives the per-slide timer (sum = 60). `builds` = how many
// extra "→" presses the slide consumes before moving on (0 = none).
export const SLIDES = [
  { id: 'intro', chapter: 0, minutes: 5, builds: 0 },
  // 1 · How AI works, ending with how we got from chatbots to agents
  { id: 'aiMap', chapter: 1, minutes: 2, builds: 0 },
  { id: 'network', chapter: 1, minutes: 3, builds: 0 },
  { id: 'learning', chapter: 1, minutes: 3, builds: 0 },
  { id: 'tokens', chapter: 1, minutes: 2, builds: 0 },
  { id: 'attention', chapter: 1, minutes: 2, builds: 0 },
  { id: 'timeline', chapter: 1, minutes: 2, builds: 7 },
  // 2 · Chatbot vs agent (the core topic)
  { id: 'agents', chapter: 2, minutes: 2, builds: 0 },
  { id: 'anatomy', chapter: 2, minutes: 2, builds: 0 },
  { id: 'agentLab', chapter: 2, minutes: 6, builds: 8 },
  // 3 · Where it applies in government
  { id: 'useCases', chapter: 3, minutes: 6, builds: 0 },
  { id: 'caseStudy', chapter: 3, minutes: 7, builds: 5 },
  // 4 · What the law allows
  { id: 'law', chapter: 4, minutes: 2, builds: 0 },
  { id: 'lawAi', chapter: 4, minutes: 3, builds: 0 },
  // 5 · Where it is heading
  { id: 'future2031', chapter: 5, minutes: 2, builds: 2 },
  { id: 'future2036', chapter: 5, minutes: 2, builds: 2 },
  // 6 · Our responsibility · 7 · Conclusion
  { id: 'dilemma', chapter: 6, minutes: 4, builds: 3 },
  { id: 'principles', chapter: 6, minutes: 3, builds: 0 },
  { id: 'conclusion', chapter: 7, minutes: 2, builds: 0 },
  { id: 'sources', chapter: 7, minutes: 0, builds: 0, appendix: true },
];
export const CHAPTER_COUNT = 8;
export const SITE_URL = 'https://ihtoriuser.github.io/';

// Synthetic appeals for the agent demo (no real data).
export const demoRecords = [
  { id: 'M-101', category: 'utility', due: '2026-10-06', department: 'A', state: 'open' },
  { id: 'M-102', category: 'certificate', due: '2026-10-18', department: 'B', state: 'open' },
  { id: 'M-103', category: 'landscaping', due: '2026-10-09', department: 'C', state: 'open' },
  { id: 'M-104', category: 'certificate', due: '2026-10-02', department: 'B', state: 'closed' },
  { id: 'M-105', category: 'landscaping', due: '2026-10-04', department: 'C', state: 'open' },
];

// Verified on Lex.uz on 2026-10-11 (see docs/legal-verification.md). kind: binding | strategy
// group: data = personal data & strategy (slide 'law'), ai = AI-specific rules (slide 'lawAi')
export const LAWS = [
  { id: 'pd547', group: 'data', number: 'O‘RQ-547', date: '2019-07-02', effective: '2019-10-01', kind: 'binding', url: 'https://lex.uz/docs/-4396419' },
  { id: 'pq358', group: 'data', number: 'PQ-358', date: '2024-10-14', effective: '2024-10-17', kind: 'strategy', url: 'https://lex.uz/docs/7158604' },
  { id: 'ai1115', group: 'ai', number: 'O‘RQ-1115', date: '2026-01-21', effective: '2026-01-21', kind: 'binding', url: 'https://www.lex.uz/uz/docs/-8008401' },
  { id: 'eth3787', group: 'ai', number: '284-mh · №3787', date: '2026-02-24', effective: '2026-06-17', kind: 'binding', url: 'https://lex.uz/docs/8083233' },
  { id: 'pd1125', group: 'data', number: 'O‘RQ-1125', date: '2026-03-26', effective: '2026-03-27', kind: 'binding', url: 'https://lex.uz/uz/docs/8099215' },
];

// The AI timeline (2021 → 2036) lives in ./aiTimeline.js.

export const SCIENCE = [
  { id: 'llm', source: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course/llm/transformers' },
  { id: 'inference', source: 'Google ML Glossary', url: 'https://developers.google.com/machine-learning/glossary/fundamentals#inference' },
  { id: 'attention', source: 'Vaswani et al., 2017', url: 'https://arxiv.org/abs/1706.03762' },
  { id: 'fewshot', source: 'Brown et al., 2020', url: 'https://arxiv.org/abs/2005.14165' },
  { id: 'rag', source: 'Lewis et al., 2020', url: 'https://arxiv.org/abs/2005.11401' },
  { id: 'agents', source: 'Anthropic, 2024', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
];

export const USE_CASES = [
  { id: 'appeals', icon: 'people', risk: 'mid', arch: 'workflowAgent' },
  { id: 'legalSearch', icon: 'balance', risk: 'mid', arch: 'rag' },
  { id: 'classify', icon: 'document', risk: 'low', arch: 'ml' },
  { id: 'letters', icon: 'notes', risk: 'mid', arch: 'llmTemplate' },
  { id: 'routine', icon: 'reset', risk: 'low', arch: 'code' },
  { id: 'knowledge', icon: 'book', risk: 'mid', arch: 'ragAccess' },
  { id: 'service', icon: 'building', risk: 'mid', arch: 'ragOperator' },
];
