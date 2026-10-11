import { SlideHead, SourceLink, fmtDate } from './common.jsx';
import { LAWS, SCIENCE, EVENTS } from '../content/data.js';

export default function Sources({ t }) {
  const s = t.slides.sources;
  return <div className="slide">
    <SlideHead s={s} />
    <div className="sources-grid">
      <section><h3>{s.lawTitle}</h3>{LAWS.map(l => <div className="source-row" key={l.id}><b>{t.lawNumbers?.[l.id] ?? l.number} · {fmtDate(l.date)}</b><span>{t.laws[l.id].name}</span><SourceLink href={l.url}>lex.uz</SourceLink></div>)}</section>
      <section><h3>{s.sciTitle}</h3>{SCIENCE.map(x => <div className="source-row" key={x.id}><b>{t.science[x.id]}</b><SourceLink href={x.url}>{x.source}</SourceLink></div>)}</section>
      <section><h3>{s.newsTitle}</h3>{[...EVENTS].reverse().map(e => <div className="source-row" key={e.id}><b>{fmtDate(e.date)} · {t.events[e.id].title}</b><SourceLink href={e.url}>{e.source}</SourceLink></div>)}</section>
      <section><h3>{s.limitsTitle}</h3><ul className="limits">{s.limits.map(x => <li key={x}>{x}</li>)}</ul></section>
    </div>
  </div>;
}
