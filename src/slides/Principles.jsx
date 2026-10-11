import Icon from '../components/Icon.jsx';

const ICONS = ['shield', 'balance', 'search', 'people', 'check', 'spark', 'route'];

export default function Principles({ t }) {
  const s = t.slides.principles;
  return <div className="slide principles-slide">
    <div className="principles-top">
      <div>
        <div className="eyebrow"><span />{s.eyebrow}</div>
        <h1>{s.title} <em>{s.em}</em></h1>
        {s.text.map((p, i) => <p key={i} className={i ? 'strong' : ''}>{p}</p>)}
      </div>
      <figure>
        <svg className="gap-chart" viewBox="0 0 420 220" role="img" aria-label={s.chart.gap}>
          <path d="M30 190H400M30 190V20" className="axis" />
          <path d="M30 185 C150 180 230 150 290 100 S370 30 400 22 L400 120 C340 135 280 150 220 160 S90 182 30 185Z" className="gap" />
          <path d="M30 185 C150 180 230 150 290 100 S370 30 400 22" className="tech" />
          <path d="M30 185 C90 182 160 172 220 160 S340 135 400 120" className="ethics" />
          <text x="140" y="70" className="t-tech">{s.chart.tech}</text>
          <text x="236" y="182" className="t-eth">{s.chart.ethics}</text>
          <text x="396" y="104" textAnchor="end" className="t-gap">{s.chart.gap}</text>
          <text x="215" y="212" className="t-axis" textAnchor="middle">{s.chart.time}</text>
        </svg>
        <figcaption>{s.chart.note}</figcaption>
      </figure>
    </div>
    <div className="principle-grid">{s.items.map((p, i) => <div key={p.title} style={{ '--i': i }}><Icon name={ICONS[i]} size={22} /><b>{p.title}</b><p>{p.text}</p></div>)}</div>
    <blockquote>{s.quote}</blockquote>
  </div>;
}
