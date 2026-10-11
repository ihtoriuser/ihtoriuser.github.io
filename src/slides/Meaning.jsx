import { useEffect, useState } from 'react';
import { SlideHead, SourceLink, useCycle } from './common.jsx';
import { attention } from '../simulations/engine.js';
import { SCIENCE } from '../content/data.js';
import Icon from '../components/Icon.jsx';

const vec = id => Array.from({ length: 8 }, (_, i) => Math.sin(id * (i + 1) * .37) * .9);
// Positions for the 12 words of the embedding map, by index (groups of 3).
const POS = [[70, 60], [118, 88], [58, 112], [300, 52], [342, 92], [282, 104], [80, 230], [44, 272], [126, 284], [302, 222], [344, 266], [268, 276]];
const GROUP_COLOR = { a: '#ff9f7a', b: '#9d8cf0', c: '#5fd1c1', d: '#ffc95e' };
// Toy vectors for one attention head, by grammatical role: [person, document, state].
const ROLE = { P: [1.6, 0, 0], D: [0, 1.7, .3], V: [.4, .5, .2], C: [0, 0, 0], R: [.3, 1.6, .5], S: [0, .4, 1.4], N: [0, 0, 1.1] };

function Tokens({ s, motion }) {
  const [n, setN] = useState(motion ? 0 : s.tokens.length);
  useEffect(() => {
    if (!motion) { setN(s.tokens.length); return; }
    const id = setInterval(() => setN(x => (x >= s.tokens.length + 3 ? 0 : x + 1)), 700);
    return () => clearInterval(id);
  }, [motion, s.tokens.length]);
  return <div className="token-chain">{s.tokens.map(([tk, id], i) => <div key={i} className={i < n ? 'on' : ''}>
    <span className="tk">{tk.replace(' ', '␣')}</span><small>ID {id}</small>
    <span className="vec">{vec(id).map((v, j) => <i key={j} style={{ height: `${Math.abs(v) * 100}%`, background: v > 0 ? '#5fd1c1' : '#ff9f7a' }} />)}</span>
  </div>)}</div>;
}

function EmbedMap({ s, motion }) {
  const [sel, pick] = useCycle(s.words.length, 2200, motion);
  const [sx, sy] = POS[sel];
  const near = POS.map((p, i) => [i, Math.hypot(p[0] - sx, p[1] - sy)]).filter(([i]) => i !== sel).sort((a, b) => a[1] - b[1]).slice(0, 2).map(([i]) => i);
  return <svg className="embed-map" viewBox="0 0 400 320" role="img" aria-label={s.embTitle}>
    {Object.entries(s.groups).map(([g, label]) => { const idx = s.words.map((w, i) => w[1] === g ? i : -1).filter(i => i >= 0); const cx = idx.reduce((a, i) => a + POS[i][0], 0) / 3, cy = idx.reduce((a, i) => a + POS[i][1], 0) / 3; return <g key={g}><circle cx={cx} cy={cy} r="58" fill={GROUP_COLOR[g]} opacity=".14" /><text x={cx} y={cy + 74} textAnchor="middle" className="group-label" fill={GROUP_COLOR[g]}>{label}</text></g>; })}
    {near.map(i => <line key={i} x1={sx} y1={sy} x2={POS[i][0]} y2={POS[i][1]} className="near-line" />)}
    {s.words.map(([w, g], i) => <g key={w} className={`pt ${i === sel ? 'on' : ''} ${near.includes(i) ? 'near' : ''}`} transform={`translate(${POS[i][0]} ${POS[i][1]})`} onClick={() => pick(i)}>
      <circle r={i === sel ? 8 : 5.5} fill={GROUP_COLOR[g]} /><text x="10" y="4">{w}</text>
    </g>)}
  </svg>;
}

function Attention({ s, motion }) {
  const queries = ['R', 'D', 'S'].map(r => s.sentence.findIndex(w => w[1] === r));
  const [qi, pick] = useCycle(queries.length, 3200, motion);
  const q = queries[qi];
  const wts = attention(ROLE[s.sentence[q][1]], s.sentence.map(w => ROLE[w[1]]));
  const top = wts.indexOf(Math.max(...wts.filter((_, i) => i !== q)));
  const W = 500, step = W / s.sentence.length;
  return <>
    <svg className="attention-svg" viewBox={`0 0 ${W} 150`} role="img" aria-label={s.attTitle}>
      {s.sentence.map((_, i) => i !== q && <path key={i} d={`M${step * q + step / 2} 105 Q${(step * (q + i)) / 2 + step / 2} ${70 - Math.abs(i - q) * 13} ${step * i + step / 2} 105`} fill="none" stroke="#ff9f7a" strokeWidth={1 + wts[i] * 16} strokeOpacity={.25 + wts[i] * 1.5} strokeLinecap="round" />)}
      {s.sentence.map(([w], i) => <g key={i} transform={`translate(${step * i + step / 2} 124)`} onClick={() => queries.includes(i) && pick(queries.indexOf(i))} className={queries.includes(i) ? 'clickable' : ''}>
        <text textAnchor="middle" className={i === q ? 'q' : ''}>{w}</text>
        <text y="18" textAnchor="middle" className="pct">{(wts[i] * 100).toFixed(0)}%</text>
      </g>)}
    </svg>
    <p className="att-text">{s.attText(s.sentence[q][0], s.sentence[top][0])}</p>
  </>;
}

export function TokensSlide({ t, motion }) {
  const s = t.slides.meaning;
  return <div className="slide">
    <SlideHead s={t.slides.tokens} />
    <div className="tokens-body">
      <section className="panel dark tok-panel">
        <h3>{s.tokTitle}</h3>
        <Tokens s={s} motion={motion} />
        <p className="panel-text">{s.tokText}</p>
        <p className="panel-text muted">{s.tokNote}</p>
      </section>
      <section className="panel dark">
        <h3>{s.embTitle}</h3>
        <EmbedMap s={s} motion={motion} />
        <p className="panel-text">{s.embText}</p>
      </section>
    </div>
    <p className="caption">{s.note}</p>
  </div>;
}

export function AttentionSlide({ t, motion }) {
  const s = t.slides.meaning;
  return <div className="slide">
    <SlideHead s={t.slides.attention} />
    <div className="attention-body">
      <section className="panel dark">
        <h3>{s.attTitle}</h3>
        <Attention s={s} motion={motion} />
        <p className="panel-text muted"><code>{s.attFormula}</code></p>
      </section>
      <section className="panel hal-panel">
        <h3><Icon name="search" size={22} />{s.halTitle}</h3>
        <p>{s.halText}</p>
        <ol>{s.halChecks.map(c => <li key={c}>{c}</li>)}</ol>
      </section>
    </div>
    <p className="caption">{s.note} <SourceLink href={SCIENCE[2].url}>{SCIENCE[2].source}</SourceLink></p>
  </div>;
}
