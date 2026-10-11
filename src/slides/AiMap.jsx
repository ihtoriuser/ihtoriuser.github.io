import { lazy, Suspense } from 'react';
import { SlideHead, SourceLink, useCycle } from './common.jsx';
import { neuron } from '../simulations/engine.js';
import { SCIENCE } from '../content/data.js';

const Network = lazy(() => import('../visualizations/NeuralNetwork.jsx'));
const X = [0.9, 0.3, 0.6], W = [0.8, -0.5, 0.6], B = -0.2;

export default function AiMap({ t, motion }) {
  const s = t.slides.aiMap;
  const [lit, pick] = useCycle(4, 2600, motion);
  const { z, y } = neuron(X, W, B);
  return <div className="slide">
    <SlideHead s={s} />
    <div className="aimap-body">
      <div className="rings-col">
        <div className="rings" role="group" aria-label="AI ⊃ ML ⊃ DL ⊃ LLM">
          {s.levels.map((l, i) => <button key={l.k} className={`ring r${i} ${lit === i ? 'lit' : ''}`} onClick={() => pick(i)} aria-pressed={lit === i}><b>{l.k}</b></button>)}
        </div>
        <ol className="level-list">
          {s.levels.map((l, i) => <li key={l.k} className={lit === i ? 'lit' : ''} onMouseEnter={() => pick(i)}>
            <span className={`tag r${i}`}>{l.k}</span>
            <div><b>{l.name}</b><p>{l.text} <em>{l.ex}</em></p></div>
          </li>)}
        </ol>
      </div>
      <div className="net-col">
        <Suspense fallback={<div className="network-stage loading" />}>
          <Network motion={motion} labels={s.labels} hint={s.dragHint} />
        </Suspense>
        <div className="net-text">
          <h3>{s.netTitle}</h3>
          <p>{s.netText}</p>
          <code className="formula"><span>{s.formulaLabel}</span> y = max(0, w·x + b) = max(0, {X.map((x, i) => `${W[i]}·${x}`).join(' + ')} {B}) = <b>{y.toFixed(2)}</b></code>
          <p className="caption">{s.netNote} <SourceLink href={SCIENCE[0].url}>{SCIENCE[0].source}</SourceLink></p>
        </div>
      </div>
    </div>
  </div>;
}
