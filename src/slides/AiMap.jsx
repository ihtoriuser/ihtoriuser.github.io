import { SlideHead, SourceLink, useCycle } from './common.jsx';
import { SCIENCE } from '../content/data.js';

export default function AiMap({ t, motion }) {
  const s = t.slides.aiMap;
  const [lit, pick] = useCycle(4, 2600, motion);
  return <div className="slide">
    <SlideHead s={s} />
    <div className="aimap-body">
      <div className="rings" role="group" aria-label="AI ⊃ ML ⊃ DL ⊃ LLM">
        {s.levels.map((l, i) => <button key={l.k} className={`ring r${i} ${lit === i ? 'lit' : ''}`} onClick={() => pick(i)} aria-pressed={lit === i}><b>{l.k}</b></button>)}
      </div>
      <ol className="level-list">
        {s.levels.map((l, i) => <li key={l.k} className={lit === i ? 'lit' : ''} onMouseEnter={() => pick(i)}>
          <span className={`tag r${i}`}>{l.k}</span>
          <div><b>{l.name}</b><p>{l.text}</p><em>{l.ex}</em></div>
        </li>)}
      </ol>
    </div>
    <p className="caption"><SourceLink href={SCIENCE[0].url}>{SCIENCE[0].source}</SourceLink></p>
  </div>;
}
