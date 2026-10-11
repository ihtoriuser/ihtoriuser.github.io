import { SlideHead, SimNote, useBuild } from './common.jsx';
import { SLIDES } from '../content/data.js';

const POS = [[95, 62], [330, 36], [565, 62], [565, 268], [330, 296], [95, 268]];
const MAX = SLIDES.find(x => x.id === 'caseStudy').builds;

export default function CaseStudy(props) {
  const { t } = props;
  const s = t.slides.caseStudy;
  const [b, setB] = useBuild(props, MAX);
  return <div className="slide">
    <SlideHead s={s} />
    <div className="case-body">
      <div className="case-left">
        <svg className="case-arch" viewBox="0 0 660 340" role="img" aria-label={s.nodes[b][0]}>
          {POS.map(([x, y], i) => <line key={i} x1="330" y1="168" x2={x} y2={y} className={i === b ? 'on' : i < b ? 'done' : ''} />)}
          {POS.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`} className={`arch-node ${i === b ? 'on' : i < b ? 'done' : ''} ${i === 5 ? 'human' : ''}`} onClick={() => setB(i)}>
            <rect x="-82" y="-25" width="164" height="50" rx="14" /><text y="-2" textAnchor="middle">{s.nodes[i][0]}</text><text y="15" textAnchor="middle" className="tag">{s.nodes[i][1]}</text>
          </g>)}
          <g transform="translate(330 168)" className="arch-core"><circle r="50" /><text y="-2" textAnchor="middle">{s.core[0]}</text><text y="16" textAnchor="middle" className="tag">{s.core[1]}</text></g>
          <circle r="6" className="arch-pulse" key={b}><animateMotion dur="1.1s" repeatCount="indefinite" path={`M330 168 L${POS[b][0]} ${POS[b][1]}`} /></circle>
        </svg>
        <ol className="case-steps">{s.steps.map((x, i) => <li key={x.name} className={`${i === b ? 'on' : ''} ${i < b ? 'done' : ''}`} onClick={() => setB(i)}><b>{i + 1}. {x.name}</b><span>{x.text}</span></li>)}</ol>
      </div>
      <div className="case-right">
        <div className="paper"><small>{s.appealTag}</small><h3>{s.appealTitle}</h3><p>{s.appealText}</p></div>
        <div className="panel exp">
          <h3>{s.expTitle}</h3>
          <div className="mini-flow">{s.expFlow.map(x => <span key={x}>{x}</span>)}</div>
          <p>{s.expText}</p>
          <p className="caption">{s.expNote}</p>
        </div>
      </div>
    </div>
    <SimNote t={t} />
  </div>;
}
