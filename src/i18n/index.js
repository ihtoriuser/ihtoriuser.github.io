import uz from './uz.js';
import ru from './ru.js';
import en from './en.js';

export const LANGS = [uz, ru, en];
const byCode = { uz, ru, en };

// Deep merge so any key missing in ru/en falls back to Uzbek instead of crashing.
function merge(base, over) {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) return over ?? base;
  const out = { ...base };
  for (const k of Object.keys(over || {})) out[k] = merge(base[k], over[k]);
  return out;
}
const cache = {};
export function getT(code) {
  if (!byCode[code]) code = 'uz';
  return cache[code] ??= code === 'uz' ? uz : merge(uz, byCode[code]);
}
export function initialLang() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (byCode[q]) return q;
    const saved = localStorage.getItem('lesson-lang');
    if (byCode[saved]) return saved;
  } catch { /* storage unavailable */ }
  return 'uz';
}
export function saveLang(code) { try { localStorage.setItem('lesson-lang', code); } catch { /* ignore */ } }
