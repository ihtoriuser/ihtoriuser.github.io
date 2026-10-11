import { SlideHead } from './common.jsx';
import { USE_CASES } from '../content/data.js';
import Icon from '../components/Icon.jsx';

const RULE_ICONS = ['route', 'search', 'spark', 'shield'];

export default function UseCases({ t }) {
  const s = t.slides.useCases;
  return <div className="slide">
    <SlideHead s={s} />
    <div className="usecases-body">
      <div className="table-wrap">
        <table className="uc-table">
          <thead><tr><th>{s.cols.case}</th><th>{s.cols.ai}</th><th>{s.cols.human}</th><th>{s.cols.arch}</th><th>{s.cols.risk}</th></tr></thead>
          <tbody>{USE_CASES.map(u => { const x = t.useCases[u.id]; return <tr key={u.id}>
            <td className="name"><Icon name={u.icon} size={20} />{x.name}</td>
            <td>{x.ai}</td><td className="human">{x.human}</td>
            <td><span className={`arch a-${u.arch}`}>{t.archs[u.arch]}</span></td>
            <td><span className={`risk ${u.risk}`}>{t.risk[u.risk]}</span></td>
          </tr>; })}</tbody>
        </table>
      </div>
      <aside className="rules">
        <h3>{s.rulesTitle}</h3>
        {s.rules.map((r, i) => <div key={i} className={`rule r${i}`}><Icon name={RULE_ICONS[i]} size={22} /><div><b>{r.if}</b><span>→ {r.then}</span></div></div>)}
      </aside>
    </div>
    <p className="caption">{s.note}</p>
  </div>;
}
