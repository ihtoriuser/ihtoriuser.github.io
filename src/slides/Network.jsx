import { SlideHead, useCycle } from './common.jsx';
import { probabilities } from '../simulations/engine.js';

/* A real (tiny) forward pass: 3 text features → 4 ReLU neurons → 3 softmax outputs.
 * Weights are hand-picked so the example behaves sensibly; the arithmetic is genuine. */
const W1 = [[2, 0, 0], [0, 2, 0], [0, 0, 2], [.5, .5, .5]];
const B1 = [-.5, -.5, -.5, 0];
const W2 = [[2, 0, 0, .2], [0, 2, 0, .2], [0, 0, 2, .2]];
const COLORS = ['#5fd1c1', '#ffc95e', '#9d8cf0'];

export function forward(x) {
  const h = W1.map((w, j) => Math.max(0, w.reduce((s, wi, i) => s + wi * x[i], B1[j])));
  const z = W2.map(w => w.reduce((s, wi, j) => s + wi * h[j], 0));
  return { h, p: probabilities(z) };
}

const XI = 250, XH = 470, XO = 690;
const yIn = i => 90 + i * 110, yH = j => 60 + j * 90, yOut = k => 90 + k * 110;

export default function Network({ t, motion }) {
  const s = t.slides.network;
  const [ex, pick] = useCycle(s.examples.length, 4200, motion);
  const { x } = s.examples[ex];
  const { h, p } = forward(x);
  const best = p.indexOf(Math.max(...p));
  const sure = p[best] > .7;
  const hMax = Math.max(1, ...h);
  return <div className="slide">
    <SlideHead s={s} />
    <div className="examples">{s.examples.map((e, i) => <button key={i} className={i === ex ? 'on' : ''} onClick={() => pick(i)} aria-pressed={i === ex}><span>{s.inputLabel}</span>“{e.text}”</button>)}</div>
    <div className="net-wrap">
      <svg className="net-svg" viewBox="0 0 960 400" role="img" aria-label={`${s.examples[ex].text} → ${s.classes[best]} ${(p[best] * 100).toFixed(0)}%`} key={ex}>
        {/* input → hidden */}
        {W1.flatMap((w, j) => w.map((wi, i) => { const a = wi * x[i]; return <line key={`a${i}${j}`} x1={XI} y1={yIn(i)} x2={XH} y2={yH(j)} className={`edge ${a > 0 ? 'live' : ''}`} strokeWidth={1 + Math.abs(a) * 3} /> }))}
        {/* hidden → output */}
        {W2.flatMap((w, k) => w.map((wk, j) => { const a = wk * h[j]; return <line key={`b${j}${k}`} x1={XH} y1={yH(j)} x2={XO} y2={yOut(k)} className={`edge ${a > 0 ? 'live late' : ''}`} strokeWidth={1 + Math.abs(a) * 2} /> }))}
        {/* input nodes + labels */}
        {s.features.map((f, i) => <g key={f} transform={`translate(${XI} ${yIn(i)})`} className={`in-node ${x[i] ? 'on' : ''}`}>
          <text x="-34" y="-6" textAnchor="end" className="feat">{f}</text>
          <text x="-34" y="16" textAnchor="end" className="sub">{x[i] ? '✓' : '—'}</text>
          <circle r="24" /><text y="7" textAnchor="middle" className="val">{x[i]}</text>
        </g>)}
        {/* hidden nodes, brightness = activation */}
        {h.map((v, j) => <g key={j} transform={`translate(${XH} ${yH(j)})`} className="h-node">
          <circle r="20" style={{ fillOpacity: .25 + .75 * (v / hMax) }} /><text y="5" textAnchor="middle">{v.toFixed(1)}</text>
        </g>)}
        {/* output nodes + bars */}
        {s.classes.map((c, k) => <g key={c} transform={`translate(${XO} ${yOut(k)})`} className={`out-node ${k === best ? 'best' : ''}`}>
          <circle r="26" fill={COLORS[k]} style={{ fillOpacity: .25 + .75 * p[k] }} /><text y="6" textAnchor="middle" className="pct">{(p[k] * 100).toFixed(0)}%</text>
          <text x="40" y="-4" className="cls">{c}</text>
          <rect x="40" y="6" width="200" height="10" rx="5" className="track" /><rect x="40" y="6" width={200 * p[k]} height="10" rx="5" fill={COLORS[k]} className="fill" />
        </g>)}
      </svg>
      <div className={`verdict ${sure ? 'sure' : 'unsure'}`}><b>{sure ? s.confident : s.uncertain}</b><span>{s.classes[best]} · {(p[best] * 100).toFixed(0)}%</span></div>
    </div>
    <ol className="layer-legend">{s.layers.map(l => <li key={l}>{l}</li>)}</ol>
    <p className="explain">{s.explain}</p>
    <p className="caption">{s.note}</p>
  </div>;
}
