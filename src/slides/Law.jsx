import { SlideHead, SourceLink, fmtDate } from './common.jsx';
import { LAWS } from '../content/data.js';
import Icon from '../components/Icon.jsx';

function LawTable({ t, group }) {
  const s = t.slides.law;
  return <div className="table-wrap law-table-wrap">
    <table className="law-table">
      <thead><tr><th>{s.cols.doc}</th><th>{s.cols.date}</th><th>{s.cols.kind}</th><th>{s.cols.says}</th><th>{s.cols.forYou}</th><th>{s.cols.source}</th></tr></thead>
      <tbody>{LAWS.filter(l => l.group === group).map((l, i) => {
        const x = t.laws[l.id];
        return <tr key={l.id} className={`k-${l.kind}`} style={{ '--i': i }}>
          <td className="doc"><b>{t.lawNumbers?.[l.id] ?? l.number}</b><span>{x.name}</span></td>
          <td className="date">{fmtDate(l.date)}<small>{s.effective}: {fmtDate(l.effective)}</small></td>
          <td><span className={`kind ${l.kind}`}>{t.lawKinds[l.kind]}</span></td>
          <td>{x.says}</td>
          <td className="foryou">{x.forYou}</td>
          <td><SourceLink href={l.url}>Lex.uz</SourceLink></td>
        </tr>;
      })}</tbody>
    </table>
  </div>;
}

/* 1/2 — personal data & strategy */
export default function Law({ t }) {
  const s = t.slides.law;
  return <div className="slide">
    <SlideHead s={s} />
    <h2 className="table-title">{s.subtitle}</h2>
    <LawTable t={t} group="data" />
    <p className="caption">{s.note}</p>
  </div>;
}

/* 2/2 — AI-specific rules + takeaways */
export function LawAi({ t }) {
  const s = t.slides.law;
  return <div className="slide">
    <SlideHead s={t.slides.lawAi} />
    <LawTable t={t} group="ai" />
    <div className="law-takeaways">{s.takeaways.map((k, i) => <div key={i} className={i < 2 ? 'binding' : 'advice'}>
      <span><Icon name={i < 2 ? 'balance' : 'check'} size={18} />{k.tag}</span><p>{k.text}</p>
    </div>)}</div>
    <p className="caption">{s.note}</p>
  </div>;
}
