import { SlideHead, SourceLink, useCycle } from './common.jsx';
import { SCIENCE } from '../content/data.js';

function Anatomy({ s, sel, pick }) {
  const n = s.nodes;
  const node = (id, x, y, label, color) => <g className={`anat-node ${sel === id ? 'on' : ''}`} transform={`translate(${x} ${y})`} onClick={() => pick(id)}>
    <circle r="40" fill={color} /><circle r="40" className="ring" /><text y="5" textAnchor="middle" style={{ fontSize: label.length > 9 ? 10.5 : 13 }}>{label}</text>
  </g>;
  return <svg className="anatomy-svg" viewBox="0 0 600 440" role="img" aria-label={s.anatomyTitle}>
    <g className={`anat-frame ${sel === 'orch' ? 'on' : ''}`} onClick={() => pick('orch')}><rect x="12" y="12" width="576" height="416" rx="30" /><text x="34" y="44">{n.orch}</text></g>
    <g className={`anat-loop ${sel === 'loop' ? 'on' : ''}`} onClick={() => pick('loop')}><circle cx="290" cy="240" r="130" /><path d="M408 190 421 211 398 214" /><path d="M172 290 159 269 182 266" /></g>
    <g className="anat-core"><circle cx="290" cy="240" r="54" /><text x="290" y="236" textAnchor="middle">{n.core}</text><text x="290" y="256" textAnchor="middle" className="sub">{n.coreSub}</text></g>
    {node('plan', 290, 108, n.plan, '#ffcf6e')}
    {node('tools', 420, 200, n.tools, '#7fd8c9')}
    {node('observe', 372, 356, n.observe, '#a99af2')}
    {node('memory', 208, 356, n.memory, '#f6a38a')}
    {node('human', 160, 200, n.human, '#9cd27f')}
    <g className="tool-icons" aria-hidden="true">
      {[n.api, n.db, n.doc].map((x, i) => <g key={x}><rect x="500" y={146 + i * 34} width="70" height="26" rx="8" /><text x="535" y={164 + i * 34} textAnchor="middle">{x}</text></g>)}
      <path d="M460 200h40M460 200l40-41M460 200l40 26" />
    </g>
  </svg>;
}

export default function Agents({ t }) {
  const s = t.slides.agents;
  return <div className="slide">
    <SlideHead s={s} />
    <div className="table-wrap">
      <table className="compare-table">
        <thead><tr><th />{s.types.map((x, i) => <th key={x.name} className={i === 4 ? 'agent' : ''}><span>0{i + 1}</span>{x.name}</th>)}</tr></thead>
        <tbody>{['path', 'tools', 'example'].map(r => <tr key={r}><th>{s.rows[r]}</th>{s.types.map((x, i) => <td key={i} className={i === 4 ? 'agent' : ''}>{x[r]}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <div className="autonomy-scale"><span>{s.autonomy[0]}</span><div className="scale-track">{s.types.map((_, i) => <i key={i} />)}</div><span>{s.autonomy[1]}</span></div>
    <p className="key-line">{s.key}</p>
    <SourceLink href={SCIENCE[5].url}>{SCIENCE[5].source} · Building effective agents</SourceLink>
  </div>;
}

export function AnatomySlide({ t, motion }) {
  const s = t.slides.agents;
  const [ci, pickIndex] = useCycle(s.concepts.length, 3000, motion);
  const sel = s.concepts[ci].id;
  const pick = id => pickIndex(s.concepts.findIndex(c => c.id === id));
  return <div className="slide">
    <SlideHead s={t.slides.anatomy} />
    <div className="agents-body">
      <Anatomy s={s} sel={sel} pick={pick} />
      <div className="concepts">
        <dl>{s.concepts.map(c => <div key={c.id} className={c.id === sel ? 'on' : ''} onMouseEnter={() => pick(c.id)}><dt>{c.title}</dt><dd>{c.text}</dd></div>)}</dl>
      </div>
    </div>
  </div>;
}
