import { demoRecords } from '../content/data.js';

export const DEMO_DATE = '2026-10-12';

/* ---------- Agent simulation ----------
 * Stages: 0 understand, 1 choose tool, 2 query, 3 analyse (+ dynamic tool choice),
 * 4 draft notices, 5 human approval, 6 execute / reject, 7 outcome.
 * Pure and language-neutral: errors are codes, drafts are data. */
export const STAGE_COUNT = 8;
export const TOOLS = [
  { name: 'list_appeals', risk: 'low' },
  { name: 'find_responsible', risk: 'low' },
  { name: 'draft_notice', risk: 'low' },
  { name: 'send_notice', risk: 'high' },
];
const directory = { utility: 'A', certificate: 'B', landscaping: 'C' };

export const initialAgent = { step: 0, permission: true, surprise: true, records: [], overdue: [], calls: [], drafts: [], selected: {}, decision: null, sent: [], error: null, lookupDone: false };

const call = (calls, name, args, result, status = 'ok') => [...calls, { id: calls.length + 1, name, args, result, status }];
export const isOverdue = r => r.due < DEMO_DATE && r.state === 'open';
export const needsLookup = state => state.overdue.some(r => !r.department);
export const daysLate = due => Math.round((Date.parse(DEMO_DATE) - Date.parse(due)) / 864e5);

export function agentReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return { ...initialAgent, surprise: action.surprise ?? initialAgent.surprise };
    case 'PERMISSION':
      return state.step <= 2 ? { ...state, permission: action.value, error: null } : state;
    case 'SURPRISE':
      return state.step <= 1 ? { ...state, surprise: action.value } : state;
    case 'EXECUTE': {
      if (state.step !== 2) return state;
      if (!state.permission) return { ...state, error: 'denied', calls: call(state.calls, 'list_appeals', { as_of: DEMO_DATE }, { error: 'permission_denied' }, 'denied') };
      const records = demoRecords.map(r => ({ ...r, department: r.id === 'M-105' && state.surprise ? null : r.department }));
      return { ...state, step: 3, error: null, records, overdue: records.filter(isOverdue), calls: call(state.calls, 'list_appeals', { as_of: DEMO_DATE, scope: 'demo' }, { count: records.length }) };
    }
    case 'LOOKUP': {
      if (state.step !== 3 || !needsLookup(state)) return state;
      let calls = state.calls;
      const overdue = state.overdue.map(r => {
        if (r.department) return r;
        const department = directory[r.category];
        calls = call(calls, 'find_responsible', { category: r.category }, { department });
        return { ...r, department, resolved: true };
      });
      return { ...state, overdue, calls, lookupDone: true, error: null };
    }
    case 'NEXT': {
      if (state.step === 0 || state.step === 1) return { ...state, step: state.step + 1 };
      if (state.step === 3) {
        if (needsLookup(state)) return { ...state, error: 'lookup' };
        let calls = state.calls;
        const drafts = state.overdue.map(r => {
          calls = call(calls, 'draft_notice', { appeal: r.id, to: r.department }, { status: 'draft' });
          return { id: r.id, to: r.department, category: r.category, days: daysLate(r.due) };
        });
        return { ...state, step: 4, error: null, calls, drafts, selected: Object.fromEntries(drafts.map(d => [d.id, true])) };
      }
      if (state.step === 4) return { ...state, step: 5 };
      if (state.step === 6) return { ...state, step: 7 };
      return state;
    }
    case 'TOGGLE':
      return state.step === 5 ? { ...state, selected: { ...state.selected, [action.id]: !state.selected[action.id] }, error: null } : state;
    case 'APPROVE': {
      if (state.step !== 5) return state;
      const ids = state.drafts.filter(d => state.selected[d.id]).map(d => d.id);
      if (!ids.length) return { ...state, error: 'empty' };
      let calls = state.calls;
      ids.forEach(id => { calls = call(calls, 'send_notice', { appeal: id, approved_by: 'human' }, { simulated: true }); });
      return { ...state, step: 6, decision: 'approved', sent: ids, calls, error: null };
    }
    case 'REJECT':
      return state.step === 5 ? { ...state, step: 6, decision: 'rejected', sent: [], error: null } : state;
    default:
      return state;
  }
}

/** What the agent does on its own next; null = it waits for a human (approval gate, denial, end). */
export function nextAction(state) {
  if (state.error === 'denied' && state.step === 2) return null;
  if (state.step === 2) return { type: 'EXECUTE' };
  if (state.step === 3 && needsLookup(state)) return { type: 'LOOKUP' };
  if (state.step === 5 || state.step === 7) return null;
  return { type: 'NEXT' };
}

/** The presenter's "→": the agent's own move, or approving at the gate. */
export function presenterAction(state) {
  if (state.step === 5) return { type: 'APPROVE' };
  return nextAction(state);
}

/* ---------- Math helpers ---------- */
export function probabilities(logits, temperature = 1) { const max = Math.max(...logits); const exp = logits.map(l => Math.exp((l - max) / temperature)); const total = exp.reduce((a, b) => a + b, 0); return exp.map(e => e / total); }
export function trainStep(logits, target = 0, rate = .55) { const p = probabilities(logits); return logits.map((w, i) => w - rate * (p[i] - (i === target ? 1 : 0))); }
export function neuron(inputs, weights, bias) { const z = inputs.reduce((s, x, i) => s + x * weights[i], bias); return { z, y: Math.max(0, z) }; }
export function attention(query, keys) { const scores = keys.map(k => k.reduce((s, v, i) => s + v * query[i], 0) / Math.sqrt(query.length)); return probabilities(scores); }

/* ---------- Presentation timing ---------- */
export const fmtClock = s => { const a = Math.max(0, Math.floor(Math.abs(s))); return `${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`; };
/** Minutes planned before slide i starts (for "ahead / behind plan"). */
export const plannedStart = (slides, i) => slides.slice(0, i).reduce((s, x) => s + x.minutes, 0) * 60;
