import { SlideHead, SourceLink, useBuild, useCycle } from './common.jsx';
import { SCENARIOS, VIZ, FUTURE_THEMES, EVIDENCE } from '../content/aiTimeline.js';
import { YearNav, tlState } from './AiHistory.jsx';
import Icon from '../components/Icon.jsx';

const ORDER = SCENARIOS.map(s => s.id);           // baseline → cautious → accelerated (→ steps through them)
const COLOR = Object.fromEntries(SCENARIOS.map(s => [s.id, s.color]));
const BRANCH_Y = { accelerated: 40, baseline: 92, cautious: 144 };

/* Branching futures (top) and an "institution" scene whose density depends on year × scenario (bottom). */
function Scene({ year, scenario, T, motion }) {
  const v = VIZ[year][scenario];
  const xEnd = year === '2031' ? 300 : 500;
  const cx = 270, cy = 300;
  const agents = Array.from({ length: v.agents }, (_, i) => { const a = (i / v.agents) * Math.PI * 2 - Math.PI / 2; const r = 96 + (i % 2) * 22; return [cx + Math.cos(a) * r * 1.35, cy + Math.sin(a) * r * .72]; });
  const links = Array.from({ length: v.links }, (_, i) => [i % v.agents, (i * 3 + 1) % v.agents]).filter(([a, b]) => a !== b);
  return <svg className="future-scene" viewBox="0 0 540 420" role="img" aria-label={`${year} — ${T.scenarios[scenario].name}`}>
    {/* branches from TODAY */}
    <g className="fbranch">
      <circle cx="40" cy="92" r="11" className="now" /><text x="40" y="124" textAnchor="middle" className="lab">{T.ui.today}</text>
      {ORDER.map(id => <path key={id} d={`M40 92 C 120 92, 140 ${BRANCH_Y[id]}, 300 ${BRANCH_Y[id]} S 440 ${BRANCH_Y[id] + (id === 'cautious' ? 8 : id === 'accelerated' ? -10 : 0)}, 500 ${BRANCH_Y[id] + (id === 'cautious' ? 8 : id === 'accelerated' ? -10 : 0)}`} stroke={COLOR[id]} className={id === scenario ? 'on' : ''} />)}
      {['2031', '2036'].map(y => <g key={y} transform={`translate(${y === '2031' ? 300 : 500} 0)`}><line y1="18" y2="168" className="yline" /><text y="14" textAnchor="middle" className={`lab ${y === year ? 'cur' : ''}`}>{y}</text></g>)}
      <circle cx={xEnd} cy={BRANCH_Y[scenario] + (year === '2036' ? (scenario === 'cautious' ? 8 : scenario === 'accelerated' ? -10 : 0) : 0)} r="9" fill={COLOR[scenario]} className="endpoint" />
    </g>
    {/* the institution and its agents */}
    <g className="gov-scene" key={`${year}-${scenario}`}>
      {Array.from({ length: v.rings }, (_, i) => <ellipse key={i} cx={cx} cy={cy} rx={170 + i * 18} ry={95 + i * 10} className="gring" />)}
      {links.map(([a, b], i) => <line key={i} x1={agents[a][0]} y1={agents[a][1]} x2={agents[b][0]} y2={agents[b][1]} className="alink" />)}
      {agents.map(([x, y], i) => <line key={`c${i}`} x1={x} y1={y} x2={cx} y2={cy} className="alink core" />)}
      <g transform={`translate(${cx} ${cy})`} className="inst">
        <path d="M-46 -6 0 -34 46 -6Z" /><rect x="-40" y="-6" width="80" height="44" rx="4" /><path d="M-28 0v32M-10 0v32M10 0v32M28 0v32" className="cols" /><rect x="-48" y="38" width="96" height="8" rx="3" />
      </g>
      <g className={motion ? 'orbit' : ''} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {agents.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
          {/* inner group animates; the outer one keeps the SVG position (CSS transform would override it) */}
          <g className="agent" style={{ animationDelay: `${i * 60}ms` }}><circle r="11" fill={COLOR[scenario]} /><circle r="3.5" cx="-3.5" cy="-1" className="eye" /><circle r="3.5" cx="3.5" cy="-1" className="eye" /><line y1="-11" y2="-17" className="ant" /></g>
        </g>)}
      </g>
      {Array.from({ length: v.science }, (_, i) => <g key={i} transform={`translate(${70 + i * 46} 222)`} className="atom"><ellipse rx="14" ry="5" /><ellipse rx="14" ry="5" transform="rotate(60)" /><ellipse rx="14" ry="5" transform="rotate(-60)" /><circle r="3" /></g>)}
      {Array.from({ length: v.humans }, (_, i) => <g key={i} transform={`translate(${380 + i * 44} 400)`} className="human"><circle cy="-26" r="9" /><path d="M-14 0 a14 14 0 0 1 28 0Z" /></g>)}
    </g>
  </svg>;
}

function FutureYear({ year, ...props }) {
  const { t, goTo, motion } = props;
  const T = t.tl, F = T.future[year];
  const [b, setB] = useBuild(props, ORDER.length - 1);
  const scenario = ORDER[b];
  tlState.scenario = scenario;
  const themes = FUTURE_THEMES[year];
  const [ti, pick] = useCycle(themes.length, 5200, motion);
  const th = themes[ti], x = F.themes[th.id];
  // 2031 = forecast; 2036 and anything speculative = possibility
  const speculative = lvl => lvl === 4 || year === '2036';
  const label = lvl => speculative(lvl) ? T.ui.labels.possibility : T.ui.labels.forecast;
  return <div className="slide future-slide" style={{ '--sc': COLOR[scenario] }}>
    <p className="future-banner"><Icon name="spark" size={16} />{T.ui.futureBanner}</p>
    <SlideHead s={T.slides[`future${year}`]} />
    <div className="tl-controls">
      <YearNav t={t} active={year} goTo={goTo} />
      <div className="scenario-pick" role="group" aria-label={T.ui.scenario}>
        {ORDER.map((id, i) => <button key={id} className={id === scenario ? 'on' : ''} style={{ '--c': COLOR[id] }} aria-pressed={id === scenario} onClick={() => setB(i)} title={T.scenarios[id].short}><i />{T.scenarios[id].name}</button>)}
      </div>
    </div>
    <div className="future-body">
      <section className="future-left">
        <Scene year={year} scenario={scenario} T={T} motion={motion} />
        <p className="sc-summary" key={scenario}><b>{T.scenarios[scenario].name}.</b> {F.summary[scenario]}</p>
        <div className="br">
          <div className="ben"><span className="lbl poss"><Icon name="check" size={13} />{T.ui.fields.benefits}</span><ul>{F.benefits[scenario].map(s => <li key={s}>{s}</li>)}</ul></div>
          <div className="rsk"><span className="lbl risk"><Icon name="shield" size={13} />{T.ui.labels.risk}</span><ul>{F.risks[scenario].map(s => <li key={s}>{s}</li>)}</ul></div>
        </div>
      </section>
      <section className="future-right">
        <div className={`theme-cards n${themes.length}`}>{themes.map((h, i) => <button key={h.id} className={`tcard lvl${h.level} ${i === ti ? 'on' : ''}`} onClick={() => pick(i)} aria-pressed={i === ti}>
          <span className={`lbl ${speculative(h.level) ? 'poss' : 'fc'}`}>{label(h.level)}</span>
          <b>{F.themes[h.id].title}</b>
          <span className="txt" key={scenario}>{F.themes[h.id][scenario]}</span>
        </button>)}</div>
        <div className="tdetail" aria-live="polite">
          <b>{x.title}</b>
          <p><span className="k">{T.ui.fields.assumption}:</span> {x.assumption}</p>
          <p><span className="lbl risk">{T.ui.labels.risk}</span> <span className="k">{T.ui.fields.obstacle}:</span> {x.obstacle}</p>
          <p className="lvl-line">{T.ui.levelTitle}: {T.ui.levels.map((l, i) => <span key={l} className={i + 1 === th.level ? 'on' : ''}>{l}</span>)}</p>
        </div>
        {year === '2036' && <p className="key-line takeaway"><Icon name="shield" size={20} />{T.ui.takeaway}</p>}
      </section>
    </div>
    <p className="evidence-line"><span className="lbl fact">{T.ui.levels[0]}</span>{T.ui.evidenceRef} {EVIDENCE.slice(0, 3).map(e => <SourceLink key={e.id} href={e.url}>{e.source}</SourceLink>)} <em>{T.ui.noProb}</em></p>
  </div>;
}

export const Future2031 = props => <FutureYear year="2031" {...props} />;
export const Future2036 = props => <FutureYear year="2036" {...props} />;
