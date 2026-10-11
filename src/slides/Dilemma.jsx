import { SlideHead, useBuild } from './common.jsx';
import { SLIDES } from '../content/data.js';
import Icon from '../components/Icon.jsx';

const METERS = [[10, 15, 95, 20], [90, 90, 55, 85], [60, 35, 85, 45]];
const TONES = ['coral', 'teal', 'gold'];
const MAX = SLIDES.find(x => x.id === 'dilemma').builds;

export default function Dilemma(props) {
  const { t } = props;
  const s = t.slides.dilemma;
  const [b] = useBuild(props, MAX);
  return <div className="slide slide-dilemma">
    <SlideHead s={s} />
    <div className="case-banner">
      <Icon name="balance" size={40} />
      <div><small>{s.caseTag}</small><h2>{s.caseText}</h2><p>{s.signalNote}</p></div>
    </div>
    <div className="options">{s.options.map((o, i) => <article key={i} className={`option ${TONES[i]}`}>
      <h3><span>0{i + 1}</span>{o.title}</h3>
      <div className={`reveal ${b >= 1 ? 'shown' : ''}`}>
        <p>{o.now}</p>
        <div className="meters">{s.meters.map((m, k) => <div key={m} className="meter"><span>{m}</span><div><i style={{ width: b >= 1 ? `${METERS[i][k]}%` : 0 }} /></div></div>)}</div>
      </div>
      <div className={`reveal after ${b >= 2 ? 'shown' : ''}`}><b>{s.truthTitle}</b> {o.after}</div>
    </article>)}</div>
    <div className={`truth ${b >= 2 ? 'shown' : ''}`}><b>{s.truthTitle}</b> {s.truth}</div>
    <div className={`who ${b >= 3 ? 'shown' : ''}`}><h3>{s.whoTitle}</h3><p>{s.who}</p></div>
    <p className="caption">{s.note}</p>
  </div>;
}
