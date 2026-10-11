import World from '../illustrations/World.jsx';
import Icon from '../components/Icon.jsx';

const ASK_ICONS = ['document', 'search', 'chart', 'people'];

export default function Intro({ t }) {
  const s = t.slides.intro;
  return <div className="slide intro-slide">
    <div className="intro-copy">
      <div className="eyebrow"><span />{s.eyebrow}</div>
      <h1 className="hero-title">{s.title.map((l, i) => <span key={i} className={`l${i}`}>{l}</span>)}</h1>
      <p className="lead">{s.lead}</p>
      <div className="why">
        <h3>{s.whyTitle}</h3>
        <ol>{s.why.map((w, i) => <li key={i} style={{ '--i': i }}>{w}</li>)}</ol>
      </div>
      <div className="agenda">{s.agenda.map((a, i) => <span key={a}><b>{i + 1}</b>{a}</span>)}</div>
    </div>
    <div className="intro-side">
      <div className="intro-art"><World label={t.ui.course} /></div>
      <div className="presenter-card">
        <div className="avatar">IB</div>
        <div>
          <strong>Ihtiyorjon Bahramov</strong><span>{s.role}</span>
          <ul>{s.exp.map(e => <li key={e}>{e}</li>)}</ul>
          <small>{s.expNote}</small>
        </div>
      </div>
      <div className="ask-card">
        <b>{s.askTitle}</b>
        <div>{s.ask.map((a, i) => <span key={a}><Icon name={ASK_ICONS[i]} size={18} />{a}</span>)}</div>
      </div>
    </div>
  </div>;
}
