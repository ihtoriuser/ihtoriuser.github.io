import { SlideHead, SourceLink, fmtDate } from './common.jsx';
import { EVENTS, THEMES } from '../content/data.js';
import Icon from '../components/Icon.jsx';

const color = Object.fromEntries(THEMES.map(x => [x.id, x.color]));
// Column key: the year; the busy 2024 is split into two half-year columns.
const colKey = e => e.date.startsWith('2024') ? `2024${+e.date.slice(5, 7) <= 8 ? 'a' : 'b'}` : e.date.slice(0, 4);
const COLS = [...new Set(EVENTS.map(colKey))];

/* Slide 1: what already happened, read left to right. */
export function Timeline({ t }) {
  const s = t.slides.timeline;
  return <div className="slide">
    <SlideHead s={s} />
    <div className="tl-legend">{THEMES.map(th => <span key={th.id} style={{ '--c': th.color }}><i />{t.themes[th.id].title}</span>)}</div>
    <div className="tl-grid" style={{ gridTemplateColumns: `repeat(${COLS.length}, minmax(0, 1fr)) auto` }}>
      {COLS.map((c, ci) => {
        const evs = EVENTS.filter(e => colKey(e) === c);
        return <section key={c} className={`tl-year ${c.endsWith('b') ? 'cont' : ''}`} style={{ '--d': `${ci * 120}ms` }}>
          <header><b>{c.slice(0, 4)}</b><span className="tl-axis" /></header>
          <div className="tl-cards">{evs.map(e => <article key={e.id} style={{ '--c': color[e.theme] }}>
            <small>{fmtDate(e.date)}</small>
            <b>{t.events[e.id].title}</b>
            <p>{t.events[e.id].text}</p>
            <SourceLink href={e.url}>{e.source}</SourceLink>
          </article>)}</div>
        </section>;
      })}
      <section className="tl-today"><header><b>{s.today}</b><span>{s.todayDate}</span></header><Icon name="flag" size={34} /></section>
    </div>
    <p className="caption">{s.note}</p>
  </div>;
}

/* Slide 2: today (facts) → +5 years → +10 years (forecast). */
export default function Future({ t }) {
  const s = t.slides.future;
  const byId = Object.fromEntries(EVENTS.map(e => [e.id, e]));
  return <div className="slide">
    <SlideHead s={s} />
    <div className="horizon">
      {s.cols.map((c, i) => <section key={c.label} className={`hz hz-${i}`} style={{ '--d': `${i * 150}ms` }}>
        <header><span className={`badge ${i ? 'fc-b' : 'fact-b'}`}>{c.tag}</span><h2>{c.label}</h2><b>{c.year}</b></header>
        <ul>{i === 0
          ? s.now.map(n => <li key={n.t}>{n.t} <SourceLink href={byId[n.src].url}>{byId[n.src].source}, {byId[n.src].date.slice(0, 4)}</SourceLink></li>)
          : (i === 1 ? s.in5 : s.in10).map(x => <li key={x}>{x}</li>)}</ul>
      </section>)}
    </div>
    <p className="key-line"><Icon name="shield" size={20} />{s.constant}</p>
    <p className="caption">{s.note}</p>
  </div>;
}
