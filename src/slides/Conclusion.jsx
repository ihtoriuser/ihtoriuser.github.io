import Icon from '../components/Icon.jsx';
import { SITE_URL } from '../content/data.js';

const ICONS = ['search', 'route', 'shield'];

export default function Conclusion({ t }) {
  const s = t.slides.conclusion;
  return <div className="slide conclusion-slide">
    <div className="eyebrow"><span />{s.eyebrow}</div>
    <h1>{s.title}</h1>
    <div className="takeaways">{s.takeaways.map((k, i) => <div key={i} style={{ '--i': i }}><span>0{i + 1}</span><Icon name={ICONS[i]} size={28} /><h2>{k.t}</h2><p>{k.d}</p></div>)}</div>
    <div className="closing">
      <div><span className="eyebrow">{s.askEyebrow}</span><h2>{s.ask}</h2><p>{s.askHint}</p></div>
      <div className="thanks"><img className="avatar big" src="./ava.jpg" alt="Ihtiyorjon Bahramov" /><h2>{s.thanks}</h2><p>{s.siteLabel} <a href={SITE_URL}>{SITE_URL.replace('https://', '')}</a></p></div>
    </div>
  </div>;
}
