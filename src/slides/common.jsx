import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';

export function SlideHead({ s, children }) {
  return <header className="slide-head">
    <div className="eyebrow"><span />{s.eyebrow}</div>
    <h1>{s.title}</h1>
    {s.lead && <p className="lead">{s.lead}</p>}
    {children}
  </header>;
}

export function SourceLink({ href, children, className = '' }) {
  return <a className={`source-link ${className}`} href={href} target="_blank" rel="noreferrer">{children}<Icon name="link" size={12} /></a>;
}

export function SimNote({ t }) {
  return <p className="sim-label"><span className="status-dot" />{t.ui.sim}</p>;
}

/** Build steps consumed by "→" before the slide hands over to the next one. */
export function useBuild({ ctl, fromEnd, onInfo }, max) {
  const [b, setB] = useState(fromEnd ? max : 0);
  const ref = useRef(b);
  ref.current = b;
  useEffect(() => {
    ctl.current = {
      advance: () => { if (ref.current < max) { ref.current += 1; setB(ref.current); return true; } return false; },
      retreat: () => { if (ref.current > 0) { ref.current -= 1; setB(ref.current); return true; } return false; },
    };
    return () => { ctl.current = null; };
  }, [max]);
  useEffect(() => { onInfo?.([b, max]); }, [b, max]);
  return [b, v => { ref.current = v; setB(v); }];
}

/** Auto-advancing highlight (for "show, don't click"). A manual pick pauses it for a while. */
export function useCycle(n, ms, motion) {
  const [i, setI] = useState(0);
  const hold = useRef(0);
  useEffect(() => {
    if (!motion || n < 2) return;
    const id = setInterval(() => { if (Date.now() > hold.current) setI(x => (x + 1) % n); }, ms);
    return () => clearInterval(id);
  }, [n, ms, motion]);
  return [i, v => { hold.current = Date.now() + 15000; setI(v); }];
}

export const fmtDate = d => d.split('-').reverse().join('.');
