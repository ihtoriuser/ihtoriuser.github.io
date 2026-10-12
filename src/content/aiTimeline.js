/* AI evolution 2021 → 2036. Language-neutral data; texts live in src/i18n/timeline/*.js.
 * Historical milestones were checked against primary sources on 2026-10-11 (see docs/timeline-audit.md).
 * status: what kind of event it was — never mix a research announcement with general availability. */

export const REFERENCE_DATE = '2026-10-12';
export const CATEGORIES = [
  { id: 'llm', color: '#8b7cf6' },
  { id: 'agents', color: '#ff7a59' },
  { id: 'multimodal', color: '#3fb6e8' },
  { id: 'science', color: '#7cc66b' },
  { id: 'governance', color: '#f0a531' },
];
export const HISTORY_YEARS = ['2021', '2022', '2023', '2024', '2025', '2026'];
export const FUTURE_YEARS = ['2031', '2036'];

// type: historical — evidenceStatus: verified (primary source read; secondary noted where the primary blocked automated access)
export const MILESTONES = [
  { id: 'dalle', date: '2021-01-05', org: 'OpenAI', cat: 'multimodal', status: 'research', urls: ['https://openai.com/index/dall-e/'] },
  { id: 'copilot', date: '2021-06-29', org: 'GitHub · OpenAI', cat: 'llm', status: 'preview', urls: ['https://github.blog/2021-06-29-introducing-github-copilot-ai-pair-programmer/'] },
  { id: 'alphafoldDb', date: '2021-07-22', org: 'DeepMind · EMBL-EBI', cat: 'science', status: 'release', urls: ['https://deepmind.google/discover/blog/putting-the-power-of-alphafold-into-the-worlds-hands/'] },
  { id: 'stableDiffusion', date: '2022-08-22', org: 'Stability AI', cat: 'multimodal', status: 'open', urls: ['https://stability.ai/news-updates/stable-diffusion-public-release'] },
  { id: 'chatgpt', date: '2022-11-30', org: 'OpenAI', cat: 'llm', status: 'preview', urls: ['https://openai.com/index/chatgpt/'] },
  { id: 'gpt4', date: '2023-03-14', org: 'OpenAI', cat: 'llm', status: 'release', urls: ['https://openai.com/index/gpt-4-research/'] },
  { id: 'plugins', date: '2023-03-23', org: 'OpenAI', cat: 'agents', status: 'limited', urls: ['https://openai.com/index/chatgpt-plugins/'] },
  { id: 'gemini1', date: '2023-12-06', org: 'Google DeepMind', cat: 'multimodal', status: 'release', urls: ['https://blog.google/technology/ai/google-gemini-ai/'] },
  { id: 'gpt4o', date: '2024-05-13', org: 'OpenAI', cat: 'multimodal', status: 'release', urls: ['https://openai.com/index/hello-gpt-4o/'] },
  { id: 'euAiAct', date: '2024-08-01', org: 'Yevropa Ittifoqi', cat: 'governance', status: 'law', urls: ['https://commission.europa.eu/news-and-media/news/ai-act-enters-force-2024-08-01_en'] },
  { id: 'o1', date: '2024-09-12', org: 'OpenAI', cat: 'llm', status: 'preview', urls: ['https://openai.com/index/introducing-openai-o1-preview/'] },
  { id: 'nobel', date: '2024-10-09', org: 'Nobel qo‘mitasi', cat: 'science', status: 'award', urls: ['https://www.nobelprize.org/prizes/chemistry/2024/press-release/'] },
  { id: 'computerUse', date: '2024-10-22', org: 'Anthropic', cat: 'agents', status: 'beta', urls: ['https://www.anthropic.com/news/developing-computer-use'] },
  { id: 'mcp', date: '2024-11-25', org: 'Anthropic', cat: 'agents', status: 'open', urls: ['https://www.anthropic.com/news/model-context-protocol'] },
  { id: 'deepseekR1', date: '2025-01-20', org: 'DeepSeek', cat: 'llm', status: 'open', urls: ['https://api-docs.deepseek.com/news/news250120'] },
  { id: 'operator', date: '2025-01-23', org: 'OpenAI', cat: 'agents', status: 'preview', urls: ['https://openai.com/index/introducing-operator/'] },
  { id: 'claudeCode', date: '2025-02-24', org: 'Anthropic', cat: 'agents', status: 'preview', urls: ['https://www.anthropic.com/news/claude-3-7-sonnet'] },
  { id: 'chatgptAgent', date: '2025-07-17', org: 'OpenAI', cat: 'agents', status: 'release', urls: ['https://openai.com/index/introducing-chatgpt-agent/'] },
  { id: 'gpt5', date: '2025-08-07', org: 'OpenAI', cat: 'llm', status: 'release', urls: ['https://openai.com/index/introducing-gpt-5/'] },
  { id: 'uzLaw', date: '2026-01-21', org: 'O‘zbekiston Respublikasi', cat: 'governance', status: 'law', urls: ['https://www.lex.uz/uz/docs/-8008401'] },
  { id: 'iasr', date: '2026-02-03', org: 'Y. Bengio va 100+ ekspert', cat: 'governance', status: 'report', urls: ['https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026'] },
  { id: 'gemini35', date: '2026-05-20', org: 'Google', cat: 'agents', status: 'release', urls: ['https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/'] },
  { id: 'gpt6Astra', date: '2026-09-03', org: 'OpenAI', cat: 'llm', status: 'limited', urls: ['https://openai.com/index/safety-overview-gpt-6-astra/', 'https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html'] },
  { id: 'gpt6Sol', date: '2026-10-07', org: 'OpenAI', cat: 'multimodal', status: 'release', urls: ['https://deploymentsafety.openai.com/gpt-6-october', 'https://9to5mac.com/2026/10/07/openai-brings-gpt-6-to-chatgpt-and-debuts-intelligent-ui/'] },
];

// Observed trends behind the forecasts (evidence level 1).
export const EVIDENCE = [
  { id: 'aiIndex', date: '2026-04-13', source: 'Stanford HAI · AI Index 2026', url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report' },
  { id: 'metr', date: '2026-01-29', source: 'METR · Time Horizon 1.1', url: 'https://metr.org/blog/2026-1-29-time-horizon-1-1/' },
  { id: 'iasr', date: '2026-02-03', source: 'International AI Safety Report 2026', url: 'https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026' },
  { id: 'nist', date: '2023-01-26', source: 'NIST AI RMF', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
];

/* Forecast scenarios — conditional futures, no probabilities attached.
 * type: forecast · level 3 = scenario, 4 = speculative possibility.
 * viz: parameters for the scenario illustration (agents around the institution, links, governance rings, science). */
export const SCENARIOS = [
  { id: 'baseline', color: '#3fb6e8' },
  { id: 'cautious', color: '#7cc66b' },
  { id: 'accelerated', color: '#ff7a59' },
];
export const VIZ = {
  2031: { cautious: { agents: 4, links: 4, rings: 2, science: 0, humans: 3 }, baseline: { agents: 7, links: 9, rings: 2, science: 1, humans: 3 }, accelerated: { agents: 10, links: 16, rings: 3, science: 1, humans: 2 } },
  2036: { cautious: { agents: 7, links: 8, rings: 3, science: 1, humans: 3 }, baseline: { agents: 11, links: 18, rings: 3, science: 2, humans: 3 }, accelerated: { agents: 15, links: 28, rings: 4, science: 3, humans: 2 } },
};
export const FUTURE_THEMES = {
  2031: [{ id: 'agents', level: 3 }, { id: 'government', level: 3 }, { id: 'multimodal', level: 3 }, { id: 'uzbek', level: 3 }, { id: 'governance', level: 3 }, { id: 'skills', level: 3 }],
  2036: [{ id: 'integrated', level: 3 }, { id: 'autonomy', level: 3 }, { id: 'science', level: 3 }, { id: 'services', level: 3 }, { id: 'collaboration', level: 3 }, { id: 'general', level: 4 }, { id: 'society', level: 3 }],
};
