import test from 'node:test';
import assert from 'node:assert/strict';
import { agentReducer, initialAgent, nextAction, presenterAction, probabilities, trainStep, neuron, attention, fmtClock, plannedStart } from '../src/simulations/engine.js';
import { SLIDES, LAWS, USE_CASES } from '../src/content/data.js';
import { MILESTONES, FUTURE_THEMES, SCENARIOS, EVIDENCE, REFERENCE_DATE, HISTORY_YEARS, CATEGORIES } from '../src/content/aiTimeline.js';
import { getT } from '../src/i18n/index.js';
import uz from '../src/i18n/uz.js';
import ru from '../src/i18n/ru.js';
import en from '../src/i18n/en.js';

const run = (s, ...types) => types.reduce((st, t) => agentReducer(st, typeof t === 'string' ? { type: t } : t), s);

test('agent cannot send before explicit approval', () => {
  let s = { ...initialAgent };
  for (let i = 0; i < 2; i++) { s = agentReducer(s, { type: 'APPROVE' }); assert.equal(s.sent.length, 0); s = agentReducer(s, { type: 'NEXT' }); }
  s = run(s, 'EXECUTE');
  assert.deepEqual(s.overdue.map(r => r.id), ['M-101', 'M-103', 'M-105']);
  s = run(s, 'NEXT'); assert.equal(s.step, 3); assert.equal(s.error, 'lookup');
  s = run(s, 'LOOKUP'); assert.equal(s.calls.filter(c => c.name === 'find_responsible').length, 1);
  s = run(s, 'NEXT', 'NEXT'); assert.equal(s.step, 5); assert.equal(s.drafts.length, 3);
  s = run(s, 'NEXT'); assert.equal(s.sent.length, 0);
  s = run(s, { type: 'TOGGLE', id: 'M-101' }, 'APPROVE');
  assert.deepEqual(s.sent, ['M-103', 'M-105']);
});

test('without the surprise the agent skips the extra tool', () => {
  let s = run({ ...initialAgent }, { type: 'SURPRISE', value: false }, 'NEXT', 'NEXT', 'EXECUTE');
  assert.equal(nextAction(s).type, 'NEXT');
  s = run(s, 'NEXT'); assert.equal(s.step, 4);
  assert.equal(s.calls.some(c => c.name === 'find_responsible'), false);
});

test('autonomous run stops at the human gate; presenter → approves and finishes in 8 presses', () => {
  let s = { ...initialAgent }; let guard = 0;
  while (nextAction(s) && guard++ < 20) s = agentReducer(s, nextAction(s));
  assert.equal(s.step, 5); assert.equal(s.sent.length, 0);
  s = { ...initialAgent }; let presses = 0;
  while (presenterAction(s) && presses < 20) { s = agentReducer(s, presenterAction(s)); presses++; }
  assert.equal(s.step, 7); assert.equal(presses, SLIDES.find(x => x.id === 'agentLab').builds);
});

test('read permission denial stops the tool', () => {
  let s = agentReducer({ ...initialAgent, step: 2 }, { type: 'PERMISSION', value: false });
  s = agentReducer(s, { type: 'EXECUTE' });
  assert.equal(s.step, 2); assert.equal(s.error, 'denied'); assert.equal(s.calls[0].status, 'denied');
  assert.equal(nextAction(s), null);
});

test('approving nothing is refused; rejection is terminal; reset clears state', () => {
  let s = run({ ...initialAgent }, 'NEXT', 'NEXT', 'EXECUTE', 'LOOKUP', 'NEXT', 'NEXT');
  for (const d of s.drafts) s = agentReducer(s, { type: 'TOGGLE', id: d.id });
  s = run(s, 'APPROVE'); assert.equal(s.step, 5); assert.equal(s.error, 'empty');
  s = run(s, 'REJECT', 'APPROVE'); assert.equal(s.decision, 'rejected'); assert.equal(s.sent.length, 0);
  assert.deepEqual(agentReducer(s, { type: 'RESET' }), initialAgent);
});

test('math helpers are sound', () => {
  let logits = [0, 0, 0]; let old = Infinity;
  for (let i = 0; i < 20; i++) { const p = probabilities(logits); const loss = -Math.log(p[0]); assert.ok(loss < old); old = loss; logits = trainStep(logits); }
  const cold = probabilities([2.2, 1.15, .4], .3), hot = probabilities([2.2, 1.15, .4], 2);
  assert.ok(cold[0] > hot[0]); assert.ok(Math.abs(hot.reduce((a, b) => a + b) - 1) < 1e-10);
  assert.deepEqual(neuron([1, 2], [.5, -1], .25), { z: -1.25, y: 0 });
  const a = attention([1, 0], [[1, 0], [0, 1], [-1, 0]]); assert.ok(a[0] > a[1] && a[1] > a[2]);
});

test('timing: 60 planned minutes, clock formatting', () => {
  assert.equal(SLIDES.reduce((s, x) => s + x.minutes, 0), 60);
  assert.equal(plannedStart(SLIDES, 1), 300);
  assert.equal(fmtClock(125), '02:05');
});

// Every id used by the slides must have text in every language.
test('all three languages cover every slide, law and use case', () => {
  for (const code of ['uz', 'ru', 'en']) {
    const t = getT(code);
    assert.equal(t.chapters.length, 8, code);
    for (const s of SLIDES) { assert.ok(t.slides[s.id]?.title, `${code}: slide ${s.id}`); assert.ok(t.notes[s.id], `${code}: notes ${s.id}`); }
    for (const l of LAWS) assert.ok(t.laws[l.id]?.says, `${code}: law ${l.id}`);
    for (const u of USE_CASES) assert.ok(t.useCases[u.id]?.ai, `${code}: use case ${u.id}`);
  }
});

test('timeline: verified history only, chronological, sourced, before the reference date', () => {
  assert.ok(MILESTONES.length >= 18 && MILESTONES.length <= 25, `${MILESTONES.length} milestones`);
  const cats = new Set(CATEGORIES.map(c => c.id));
  for (let i = 0; i < MILESTONES.length; i++) {
    const m = MILESTONES[i];
    assert.match(m.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(m.date <= REFERENCE_DATE, `${m.id} is in the future`);
    if (i) assert.ok(m.date >= MILESTONES[i - 1].date, `${m.id} out of order`);
    assert.ok(HISTORY_YEARS.includes(m.date.slice(0, 4)));
    assert.ok(cats.has(m.cat), m.id);
    assert.ok(m.urls.length && m.urls.every(u => /^https:\/\//.test(u)), `${m.id} source`);
    assert.ok(m.status, m.id);
  }
});

test('timeline + scenarios have complete text in all languages', () => {
  for (const code of ['uz', 'ru', 'en']) {
    const T = getT(code).tl;
    for (const m of MILESTONES) for (const f of ['title', 'what', 'tech', 'why']) assert.ok(T.milestones[m.id]?.[f], `${code}: ${m.id}.${f}`);
    for (const m of MILESTONES) assert.ok(T.ui.status[m.status], `${code}: status ${m.status}`);
    for (const y of HISTORY_YEARS) for (const f of ['title', 'story', 'gov']) assert.ok(T.years[y]?.[f], `${code}: year ${y}.${f}`);
    for (const e of EVIDENCE) assert.ok(T.evidence[e.id], `${code}: evidence ${e.id}`);
    for (const [year, themes] of Object.entries(FUTURE_THEMES)) {
      const F = T.future[year];
      for (const s of SCENARIOS) {
        assert.ok(F.summary[s.id] && F.benefits[s.id]?.length && F.risks[s.id]?.length, `${code}: ${year} ${s.id}`);
        assert.ok(T.scenarios[s.id]?.name, `${code}: scenario ${s.id}`);
      }
      for (const th of themes) for (const f of ['title', 'assumption', 'obstacle', ...SCENARIOS.map(s => s.id)]) assert.ok(F.themes[th.id]?.[f], `${code}: ${year}.${th.id}.${f}`);
    }
  }
});
