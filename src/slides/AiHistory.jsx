import { useEffect, useRef, useState } from 'react';
import { SlideHead, SourceLink, useBuild, fmtDate } from './common.jsx';
import { MILESTONES, CATEGORIES, HISTORY_YEARS, FUTURE_YEARS, REFERENCE_DATE, EVIDENCE } from '../content/aiTimeline.js';
import { SLIDES } from '../content/data.js';
import Icon from '../components/Icon.jsx';

/* Shared between the three timeline slides: chosen year / scenario survive slide changes. */
export const tlState = { year: null, scenario: 'baseline' };
export const YEAR_COLORS = { 2021: '#5fd1c1', 2022: '#7fc8ff', 2023: '#9d8cf0', 2024: '#ffb27a', 2025: '#ff7a59', 2026: '#e85d9a', 2031: '#ffd38a', 2036: '#c9b6ff' };
const catColor = Object.fromEntries(CATEGORIES.map(c => [c.id, c.color]));
const slideIndex = id => SLIDES.findIndex(s => s.id === id);

/** Year navigation 2021 → 2036, shared by all three slides. */
export function YearNav({ t, active, onHistoryYear, onToday, goTo }) {
  const T = t.tl;
  const goYear = y => {
    if (HISTORY_YEARS.includes(y)) { if (onHistoryYear) onHistoryYear(y); else { tlState.year = y; goTo(slideIndex('timeline')); } }
    else goTo(slideIndex(`future${y}`));
  };
  return <nav className="year-nav" aria-label={T.ui.year}>
    {HISTORY_YEARS.map(y => <button key={y} className={`yr ${active === y ? 'on' : ''}`} style={{ '--c': YEAR_COLORS[y] }} onClick={() => goYear(y)} aria-current={active === y ? 'true' : undefined}>{y}</button>)}
    <button className={`yr-today ${active === 'today' ? 'on' : ''}`} title={T.ui.todayNote} onClick={() => { if (onToday) onToday(); else { tlState.year = 'today'; goTo(slideIndex('timeline')); } }}><i />{T.ui.today}</button>
    {FUTURE_YEARS.map(y => <button key={y} className={`yr future ${active === y ? 'on' : ''}`} style={{ '--c': YEAR_COLORS[y] }} onClick={() => goYear(y)} aria-current={active === y ? 'true' : undefined}>{y}</button>)}
  </nav>;
}

export function SourcesPanel({ t, onClose }) {
  const T = t.tl;
  useEffect(() => { const k = e => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, []);
  return <div className="tl-sources" role="dialog" aria-label={T.ui.sources}>
    <header><h3>{T.ui.sources}</h3><button className="icon-button" onClick={onClose} aria-label={T.ui.close}><Icon name="close" /></button></header>
    <div className="tl-sources-body">
      <ol>{MILESTONES.map(m => <li key={m.id}><b>{fmtDate(m.date)}</b> {T.milestones[m.id].title} {m.urls.map((u, i) => <SourceLink key={u} href={u}>{i ? '2' : new URL(u).hostname.replace('www.', '')}</SourceLink>)}</li>)}</ol>
      <h4>{T.ui.evidenceTitle}</h4>
      <ul>{EVIDENCE.map(e => <li key={e.id}><b>{fmtDate(e.date)}</b> <SourceLink href={e.url}>{e.source}</SourceLink></li>)}</ul>
    </div>
  </div>;
}

/* The "river" of history: thicker each year (growing complexity), a TODAY marker, then dashed branches. */
const X0 = Date.parse('2021-01-01'), X1 = Date.parse('2027-01-01');
const xOf = d => 40 + ((Date.parse(d) - X0) / (X1 - X0)) * 800;
function River({ t, year, filter, selected, onPick }) {
  const T = t.tl;
  const today = xOf(REFERENCE_DATE);
  return <svg className="river" viewBox="0 0 1000 150" role="group" aria-label={`${HISTORY_YEARS[0]}–${FUTURE_YEARS.at(-1)}`}>
    {HISTORY_YEARS.map((y, i) => { const a = xOf(`${y}-01-01`), b = Math.min(xOf(`${+y + 1}-01-01`), today); return <g key={y} className={`seg ${year === y ? 'on' : ''}`}>
      <line x1={a} x2={b} y1="78" y2="78" stroke={YEAR_COLORS[y]} strokeWidth={3 + i * 1.6} strokeLinecap="round" />
      <text x={(a + xOf(`${+y + 1}-01-01`)) / 2} y="138" textAnchor="middle" className="yl">{y}</text>
    </g>; })}
    <g className="branches" aria-hidden="true">
      {[[46, '#ff7a59'], [78, '#3fb6e8'], [110, '#7cc66b']].map(([y, c]) => <path key={y} d={`M${today} 78 C ${today + 50} 78, ${today + 60} ${y}, 990 ${y}`} stroke={c} />)}
      <text x="930" y="30" className="fy">2031 · 2036</text>
    </g>
    <g className="today" transform={`translate(${today} 78)`}><circle r="13" /><circle r="22" className="halo" /><text y="-30" textAnchor="middle">{T.ui.today}</text></g>
    {MILESTONES.map((m, i) => {
      const dim = (filter !== 'all' && m.cat !== filter) || (year && !m.date.startsWith(year));
      const yOff = 78 + ((i % 3) - 1) * 22;
      return <g key={m.id} className={`ms ${dim ? 'dim' : ''} ${selected === m.id ? 'sel' : ''}`} transform={`translate(${xOf(m.date)} ${yOff})`} onClick={() => onPick(m)} onKeyDown={e => e.key === 'Enter' && onPick(m)} role="button" tabIndex={dim ? -1 : 0} aria-label={`${fmtDate(m.date)} — ${T.milestones[m.id].title}`}>
        <circle r={selected === m.id ? 9 : 6} fill={catColor[m.cat]} />
      </g>;
    })}
  </svg>;
}

function Detail({ t, m }) {
  const T = t.tl, x = T.milestones[m.id];
  return <article className="ms-detail" style={{ '--c': catColor[m.cat] }} aria-live="polite">
    <div className="badges"><span className="lbl fact"><Icon name="check" size={13} />{T.ui.labels.fact}</span><span className="lbl">{T.ui.status[m.status]}</span><span className="lbl cat">{T.categories[m.cat]}</span></div>
    <small>{fmtDate(m.date)} · {T.orgs?.[m.id] ?? m.org}</small>
    <h2>{x.title}</h2>
    <dl>
      <div><dt>{T.ui.fields.what}</dt><dd>{x.what}</dd></div>
      <div><dt>{T.ui.fields.tech}</dt><dd>{x.tech}</dd></div>
      <div><dt>{T.ui.fields.why}</dt><dd>{x.why}</dd></div>
      {x.gov && <div className="gov"><dt>{T.ui.fields.gov}</dt><dd>{x.gov}</dd></div>}
    </dl>
    <p className="src">{m.urls.map(u => <SourceLink key={u} href={u}>{new URL(u).hostname.replace('www.', '')}</SourceLink>)}</p>
  </article>;
}

export default function AiHistory(props) {
  const { t, goTo, fromEnd } = props;
  const T = t.tl;
  const TODAY = HISTORY_YEARS.length + 1; // last step: the reference date and the observed trends
  const [b, setB] = useBuild(props, TODAY);
  const [filter, setFilter] = useState('all');
  const [sel, setSel] = useState(null);
  const pending = useRef(null); // a milestone clicked on the river, selected once its year is shown
  const [showSources, setShowSources] = useState(false);
  // Arriving from a year button on another slide.
  useEffect(() => { if (tlState.year) { setB(tlState.year === 'today' ? TODAY : HISTORY_YEARS.indexOf(tlState.year) + 1); tlState.year = null; } }, []);
  const year = b > 0 && b < TODAY ? HISTORY_YEARS[b - 1] : null;
  const list = MILESTONES.filter(m => (!year || m.date.startsWith(year)) && (filter === 'all' || m.cat === filter));
  useEffect(() => { setSel(year ? pending.current ?? list[0]?.id ?? null : null); pending.current = null; }, [b, filter]);
  const current = MILESTONES.find(m => m.id === sel);
  const pick = m => {
    const nb = HISTORY_YEARS.indexOf(m.date.slice(0, 4)) + 1;
    if (nb === b) setSel(m.id); else { pending.current = m.id; setB(nb); }
  };

  return <div className="slide tl-slide">
    <SlideHead s={T.slides.timeline} />
    <div className="tl-controls">
      <button className={`yr overview ${b === 0 ? 'on' : ''}`} onClick={() => setB(0)}><Icon name="reset" size={14} />{T.ui.overview}</button>
      <YearNav t={t} active={b === TODAY ? 'today' : year} goTo={goTo} onHistoryYear={y => setB(HISTORY_YEARS.indexOf(y) + 1)} onToday={() => setB(TODAY)} />
      <div className="cat-filter" role="group" aria-label={T.ui.filter}>
        <button className={filter === 'all' ? 'on' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{T.ui.all}</button>
        {CATEGORIES.map(c => <button key={c.id} style={{ '--c': c.color }} className={filter === c.id ? 'on' : ''} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}><i />{T.categories[c.id]}</button>)}
      </div>
      <button className="button src-btn" onClick={() => setShowSources(true)}><Icon name="book" size={15} />{T.ui.sources}</button>
    </div>
    <River t={t} year={year} filter={filter} selected={sel} onPick={pick} />

    {b === TODAY ? <div className="tl-today-view">
      <header><span className="today-dot" /><div><b>{T.ui.today} — {T.ui.todayDate}</b><span>{T.ui.todayNote}</span></div></header>
      <h3>{T.ui.evidenceTitle}</h3>
      <div className="today-cards">{EVIDENCE.slice(0, 3).map(e => <article key={e.id}><span className="lbl fact"><Icon name="check" size={13} />{T.ui.levels[0]}</span><p>{T.evidence[e.id]}</p><SourceLink href={e.url}>{e.source} · {fmtDate(e.date)}</SourceLink></article>)}</div>
      <p className="to-future"><span>{T.ui.labels.fact}</span><Icon name="arrow" size={22} /><span className="fc">{T.ui.futureBanner}</span></p>
    </div> : b === 0 ? <div className="tl-overview">
      {HISTORY_YEARS.map((y, i) => { const n = MILESTONES.filter(m => m.date.startsWith(y) && (filter === 'all' || m.cat === filter)).length; return <button key={y} className="ov-year" style={{ '--c': YEAR_COLORS[y], '--d': `${i * 90}ms` }} onClick={() => setB(i + 1)}>
        <b>{y}</b><strong>{T.years[y].title}</strong><span>{T.years[y].story}</span><em>{n} ●</em>
      </button>; })}
      <p className="story-line">{T.storyLine}</p>
    </div> : <div className="tl-year-view" key={year}>
      <section className="yv-left" style={{ '--c': YEAR_COLORS[year] }}>
        <header><b>{year}</b><div><strong>{T.years[year].title}</strong><span>{T.years[year].story}</span></div></header>
        <div className="ms-list">{list.map(m => <button key={m.id} className={sel === m.id ? 'on' : ''} style={{ '--c': catColor[m.cat] }} onClick={() => setSel(m.id)} aria-pressed={sel === m.id}>
          <small>{fmtDate(m.date)} · {T.categories[m.cat]}</small><b>{T.milestones[m.id].title}</b>
        </button>)}{!list.length && <p className="muted">—</p>}</div>
        <p className="gov-line"><Icon name="building" size={16} /><span><b>{T.ui.fields.gov}:</b> {T.years[year].gov}</span></p>
        <p className="caption">{T.ui.simplified}</p>
      </section>
      {current ? <Detail t={t} m={current} /> : <div />}
    </div>}
    {showSources && <SourcesPanel t={t} onClose={() => setShowSources(false)} />}
  </div>;
}
