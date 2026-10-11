import { useEffect, useState } from 'react';
import { SlideHead, SourceLink } from './common.jsx';
import { probabilities, trainStep } from '../simulations/engine.js';
import { SCIENCE } from '../content/data.js';
import Icon from '../components/Icon.jsx';

const TRAINED = [2.2, 1.15, .4]; // logits after training (toy)
const TEMPS = [.2, 1, 2];
const MAX_STEPS = 24;

function Bars({ labels, p, best }) {
  return <div className="bars">{labels.map((l, i) => <div key={l} className={`bar ${i === best ? 'best' : ''}`}>
    <span>{l}</span><div><i style={{ width: `${p[i] * 100}%` }} /></div><b>{(p[i] * 100).toFixed(0)}%</b>
  </div>)}</div>;
}

export default function Learning({ t, motion }) {
  const s = t.slides.learning;
  const [w, setW] = useState([0, 0, 0]);
  const [hist, setHist] = useState([Math.log(3)]);
  const [run, setRun] = useState(0);
  const steps = hist.length - 1;
  useEffect(() => {
    if (steps >= MAX_STEPS) return;
    const id = setTimeout(() => {
      const nw = trainStep(w); setW(nw); setHist(h => [...h, -Math.log(probabilities(nw)[0])]);
    }, motion ? (steps === 0 ? 900 : 260) : 0);
    return () => clearTimeout(id);
  }, [w, run, motion]);
  const p = probabilities(w);
  const max = Math.log(3);
  const pts = hist.map((l, i) => `${(i / MAX_STEPS) * 300},${95 - (l / max) * 85}`).join(' ');
  const replay = () => { setW([0, 0, 0]); setHist([Math.log(3)]); setRun(r => r + 1); };
  return <div className="slide">
    <SlideHead s={s} />
    <div className="learning-body">
      <section className="panel dark train-panel">
        <h3>{s.trainTitle}</h3>
        <ol className="cycle">{s.trainSteps.map((x, i) => <li key={x} className={steps > 0 && steps < MAX_STEPS && (steps % 4) === i ? 'on' : ''}><b>{i + 1}</b>{x}</li>)}</ol>
        <div className="sentence">{s.prompt} <span className={steps >= MAX_STEPS ? 'done' : ''}>{steps >= MAX_STEPS ? s.candidates[0] : '?'}</span></div>
        <Bars labels={s.candidates} p={p} best={0} />
        <div className="loss-row">
          <div><small>{s.steps}</small><strong>{steps}</strong></div>
          <div><small>{s.loss}</small><strong>{(-Math.log(p[0])).toFixed(3)}</strong></div>
          <svg className="loss-curve" viewBox="0 0 300 100" aria-label={s.loss}><path d="M0 95H300" /><polyline points={pts} /></svg>
          <button className="icon-button light" onClick={replay} aria-label={t.ui.replay} title={t.ui.replay}><Icon name="reset" size={16} /></button>
        </div>
        <p className="panel-text">{s.trainText}</p>
      </section>
      <section className="panel infer-panel">
        <h3>{s.inferTitle}</h3>
        <p>{s.inferText}</p>
        <h4>{s.tempTitle}</h4>
        <div className="temps">{TEMPS.map((T, k) => <div key={T} className="temp-card">
          <span className="temp-label">{s.tempLabels[k]}</span>
          <Bars labels={s.candidates} p={probabilities(TRAINED, T)} best={0} />
        </div>)}</div>
        <p>{s.tempText}</p>
      </section>
    </div>
    <p className="key-line"><Icon name="spark" size={18} />{s.key}</p>
    <p className="caption">{s.note} <SourceLink href={SCIENCE[1].url}>{SCIENCE[1].source}</SourceLink></p>
  </div>;
}
