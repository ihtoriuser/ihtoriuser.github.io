import { SlideHead, SourceLink, useCycle, fmtDate } from './common.jsx';
import { EVENTS, THEMES } from '../content/data.js';

const START = Date.parse('2021-06-01'), END = Date.parse('2026-12-31');
const xOf = d => 30 + ((Date.parse(d) - START) / (END - START)) * 940;
const color = Object.fromEntries(THEMES.map(x => [x.id, x.color]));

export default function Future({ t, motion }) {
  const s = t.slides.future;
  const [ti, pick] = useCycle(THEMES.length, 4000, motion);
  const theme = THEMES[ti].id;
  return <div className="slide">
    <SlideHead s={s} />
    <div className="timeline">
      <svg viewBox="0 0 1000 150" role="img" aria-label={s.title}>
        <line x1="20" x2="980" y1="112" y2="112" className="axis" />
        {[2022, 2023, 2024, 2025, 2026].map(y => <g key={y} transform={`translate(${xOf(`${y}-01-01`)} 112)`}><line y1="-5" y2="5" className="axis" /><text y="28" textAnchor="middle" className="year">{y}</text></g>)}
        <g transform={`translate(${xOf('2026-10-11')} 112)`}><line y1="-100" y2="8" className="today" /><text y="-104" textAnchor="middle" className="today-label">{s.today}</text></g>
        {EVENTS.map((e, i) => { const y = 88 - (i % 3) * 28; const on = e.theme === theme; return <g key={e.id} className={`ev ${on ? 'on' : 'dim'}`} onClick={() => pick(THEMES.findIndex(x => x.id === e.theme))}>
          <line x1={xOf(e.date)} x2={xOf(e.date)} y1={y} y2="112" stroke={color[e.theme]} />
          <circle cx={xOf(e.date)} cy={y} r={on ? 9 : 6} fill={color[e.theme]} />
          {on && <text x={xOf(e.date)} y={y - 14} textAnchor="middle" className="ev-label">{t.events[e.id].title}</text>}
        </g>; })}
      </svg>
    </div>
    <div className="themes">{THEMES.map((th, i) => {
      const evs = EVENTS.filter(e => e.theme === th.id);
      return <article key={th.id} className={`theme ${i === ti ? 'on' : ''}`} style={{ '--c': th.color }} onMouseEnter={() => pick(i)}>
        <h3>{t.themes[th.id].title}</h3>
        {evs.map(e => <div key={e.id} className="fact"><span className="badge fact-b">{s.fact} · {fmtDate(e.date)}</span><p><b>{t.events[e.id].title}.</b> {t.events[e.id].text}</p><SourceLink href={e.url}>{e.source}</SourceLink></div>)}
        <div className="forecast"><span className="badge fc-b">{s.forecast}</span><p>{t.themes[th.id].forecast}</p></div>
      </article>;
    })}</div>
    <p className="caption">{s.note}</p>
  </div>;
}
