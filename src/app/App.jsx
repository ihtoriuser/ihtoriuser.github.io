import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { SLIDES, CHAPTER_COUNT } from '../content/data.js';
import { LANGS, getT, initialLang, saveLang } from '../i18n/index.js';
import { fmtClock, plannedStart } from '../simulations/engine.js';
import Icon from '../components/Icon.jsx';
import { SLIDE_COMPONENTS } from '../slides/index.js';

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};
const readHash = () => { const n = parseInt(location.hash.slice(1), 10); return Number.isFinite(n) ? Math.min(SLIDES.length - 1, Math.max(0, n - 1)) : 0; };
const isTyping = el => el?.closest?.('input,textarea,select,[contenteditable="true"]');

class Boundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    const { t } = this.props;
    return this.state.error ? <div className="notice"><h2>{t.ui.errorTitle}</h2><p>{t.ui.errorText}</p><button className="button" onClick={() => this.setState({ error: false })}>{t.ui.retry}</button></div> : this.props.children;
  }
}

export default function App() {
  const [index, setIndex] = useState(readHash);
  const [fromEnd, setFromEnd] = useState(false);
  const [lang, setLang] = useState(initialLang);
  const [sidebar, setSidebar] = useState(() => store.get('lesson-sidebar', typeof innerWidth === 'number' ? innerWidth > 1100 : true));
  const [motion, setMotion] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [running, setRunning] = useState(false);
  const [total, setTotal] = useState(0);
  const [perSlide, setPerSlide] = useState({});
  const [resetKey, setResetKey] = useState(0);
  const [info, setInfo] = useState(null); // [build, max] reported by the current slide
  const [fsError, setFsError] = useState(false);
  const ctl = useRef(null);
  const notes = useRef(null);
  const main = useRef(null);
  const t = getT(lang);
  const slide = SLIDES[index];
  const Slide = SLIDE_COMPONENTS[slide.id];

  const go = useCallback((i, end = false) => {
    const n = Math.min(SLIDES.length - 1, Math.max(0, i));
    setFromEnd(end); setInfo(null); setIndex(n);
    history.replaceState(null, "", `${location.pathname}${location.search}#${n + 1}`);
    if (innerWidth <= 900) setSidebar(false);
  }, []);
  const next = () => {
    if (!running && total === 0) setRunning(true); // the lecture clock starts with the first step
    if (ctl.current?.advance?.()) return;
    if (index < SLIDES.length - 1) go(index + 1);
  };
  const prev = () => { if (ctl.current?.retreat?.()) return; if (index > 0) go(index - 1, true); };

  useEffect(() => { const h = () => go(readHash()); addEventListener('hashchange', h); return () => removeEventListener('hashchange', h); }, [go]);
  useEffect(() => { main.current?.scrollTo({ top: 0 }); }, [index]);
  useEffect(() => { store.set('lesson-sidebar', sidebar); }, [sidebar]);
  useEffect(() => { saveLang(lang); document.documentElement.lang = t.htmlLang; document.title = t.ui.course; }, [lang]);

  // Timers: total lecture time + time spent on each slide.
  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now(); const d = (now - last) / 1000; last = now;
      setTotal(x => x + d);
      setPerSlide(p => ({ ...p, [index]: (p[index] || 0) + d }));
    }, 250);
    return () => clearInterval(id);
  }, [running, index]);

  const toggleFull = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); setFsError(false); }
    catch { setFsError(true); }
  };
  const cycleLang = () => setLang(l => LANGS[(LANGS.findIndex(x => x.code === l) + 1) % LANGS.length].code);
  const resetTimers = () => { setRunning(false); setTotal(0); setPerSlide({}); };

  useEffect(() => {
    const onKey = e => {
      if (notes.current?.open || e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return;
      const k = e.code;
      const act = {
        ArrowRight: next, PageDown: next, ArrowLeft: prev, PageUp: prev,
        KeyB: () => setSidebar(s => !s), KeyF: toggleFull, KeyT: () => setRunning(r => !r), KeyL: cycleLang,
        KeyN: () => notes.current?.showModal(), KeyR: () => { setResetKey(r => r + 1); setInfo(null); setFromEnd(false); }, KeyM: () => setMotion(m => !m),
        Home: () => go(0), End: () => go(SLIDES.length - 1),
      }[k];
      if (k === 'Space' && !e.target.closest('button,a,summary,label')) { e.preventDefault(); next(); return; }
      if (/^Digit[1-8]$/.test(k)) { e.preventDefault(); go(SLIDES.findIndex(s => s.chapter === +k.slice(5) - 1)); return; }
      if (act) { e.preventDefault(); act(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const slideSecs = perSlide[index] || 0;
  const planned = slide.minutes * 60;
  const pct = planned ? slideSecs / planned : 0;
  const drift = total - plannedStart(SLIDES, index) - slideSecs; // >0: behind plan
  const driftLabel = total < 1 ? '' : Math.abs(drift) < 30 ? t.ui.onPlan : `${drift > 0 ? '+' : '−'}${fmtClock(drift)} ${drift > 0 ? t.ui.behind : t.ui.ahead}`;
  const lessonSlides = SLIDES.filter(s => !s.appendix).length;

  return <div className={`app chapter-${slide.chapter + 1} slide-${slide.id} ${sidebar ? 'with-sidebar' : 'no-sidebar'} ${motion ? '' : 'motion-paused'}`}>
    <a href="#lesson-main" className="skip-link">{t.ui.skip}</a>
    {sidebar && <button className="sidebar-shade" aria-label={t.ui.close} onClick={() => setSidebar(false)} />}
    <aside className="sidebar" aria-hidden={!sidebar} inert={!sidebar}>
      <div className="brand"><img src="./favicon.png" alt="Ustudy" /><span>{t.ui.brand}</span></div>
      <div className="sidebar-title">{t.ui.course}</div>
      <nav aria-label={t.ui.sidebar}>
        {Array.from({ length: CHAPTER_COUNT }, (_, c) => {
          const items = SLIDES.map((s, i) => [s, i]).filter(([s]) => s.chapter === c);
          const mins = items.reduce((a, [s]) => a + s.minutes, 0);
          const active = slide.chapter === c;
          return <div key={c} className={`nav-chapter ${active ? 'active' : ''}`}>
            <button className="nav-head" onClick={() => go(items[0][1])} aria-current={active ? 'true' : undefined}>
              <span className="nav-number">{String(c + 1).padStart(2, '0')}</span><b>{t.chapters[c]}</b><small>{mins} {t.ui.min}</small>
            </button>
            {items.length > 1 && <div className="nav-slides">{items.map(([s, i]) => <button key={s.id} className={i === index ? 'current' : ''} onClick={() => go(i)}>{s.appendix ? `${t.ui.appendix}: ` : ''}{t.slides[s.id].title}</button>)}</div>}
          </div>;
        })}
      </nav>
      <div className="sidebar-foot"><Icon name="clock" size={14} /> 60 {t.ui.min} · 12.10.2026 · Toshkent</div>
    </aside>

    <div className="workspace">
      <header className="topbar">
        <button className="icon-button" onClick={() => setSidebar(s => !s)} aria-label={t.ui.sidebar} aria-expanded={sidebar} title={`${t.ui.sidebar} (B)`}><Icon name="menu" /></button>
        <div className="crumb"><span className="crumb-num">{String(slide.chapter + 1).padStart(2, '0')}</span><b>{t.chapters[slide.chapter]}</b></div>
        <div className="timers" aria-live="off">
          {!slide.appendix && <div className={`timer-box slide-timer ${pct > 1 ? 'over' : pct > .8 ? 'warn' : ''}`} title={t.ui.slideTime}>
            <small>{t.ui.slideTime}</small><b>{fmtClock(slideSecs)}</b><span>/ {fmtClock(planned)}</span>
            <i className="timer-bar"><i style={{ width: `${Math.min(100, pct * 100)}%` }} /></i>
          </div>}
          <div className="timer-box" title={t.ui.total}>
            <small>{t.ui.total}</small><b>{fmtClock(total)}</b><span>/ 60:00</span>
            {driftLabel && <em className={drift > 30 ? 'behind' : drift < -30 ? 'ahead' : ''}>{driftLabel}</em>}
          </div>
          <button className="icon-button" onClick={() => setRunning(r => !r)} aria-label={running ? t.ui.timerPause : t.ui.timerStart} title={`${running ? t.ui.timerPause : t.ui.timerStart} (T)`}><Icon name={running ? 'pause' : 'play'} size={17} /></button>
          <button className="icon-button" onClick={resetTimers} aria-label={t.ui.timerReset} title={t.ui.timerReset}><Icon name="reset" size={16} /></button>
        </div>
        <div className="top-actions">
          <div className="lang-switch" role="group" aria-label={t.ui.language}>{LANGS.map(l => <button key={l.code} className={lang === l.code ? 'active' : ''} aria-pressed={lang === l.code} onClick={() => setLang(l.code)} title={l.name}>{l.label}</button>)}</div>
          <button className="icon-button" onClick={() => setMotion(m => !m)} aria-label={motion ? t.ui.motionOff : t.ui.motionOn} title={`${motion ? t.ui.motionOff : t.ui.motionOn} (M)`}><Icon name="spark" size={17} className={motion ? '' : 'dim'} /></button>
          <button className="icon-button" onClick={() => notes.current?.showModal()} aria-label={t.ui.notes} title={`${t.ui.notes} (N)`}><Icon name="notes" size={17} /></button>
          <button className="icon-button" onClick={toggleFull} aria-label={t.ui.fullscreen} title={`${t.ui.fullscreen} (F)`}><Icon name="expand" size={17} /></button>
        </div>
      </header>

      <main className="lesson-main" id="lesson-main" tabIndex={-1} ref={main}>
        {fsError && <div role="alert" className="notice">{t.ui.fullscreenError}</div>}
        <div className="slide-frame" key={`${index}-${resetKey}`}>
          <Boundary t={t}><Slide t={t} lang={lang} motion={motion} ctl={ctl} fromEnd={fromEnd} onInfo={setInfo} goTo={go} /></Boundary>
        </div>
      </main>

      <footer className="lesson-footer">
        <div className="progress" aria-label={`${t.ui.slide} ${index + 1} / ${SLIDES.length}`}>
          {SLIDES.map((s, i) => <button key={s.id} className={`${i < index ? 'done' : ''} ${i === index ? 'now' : ''} ${s.appendix ? 'appendix' : ''}`} style={{ flexGrow: Math.max(1, s.minutes) }} title={`${i + 1}. ${t.slides[s.id].title}`} aria-label={`${i + 1}. ${t.slides[s.id].title}`} onClick={() => go(i)}>
            {i === index && slideSecs > 0 && planned > 0 && <i style={{ width: `${Math.min(100, pct * 100)}%` }} />}
          </button>)}
        </div>
        <span className="page-number">{slide.appendix ? t.ui.appendix : `${index + 1} / ${lessonSlides}`}</span>
        {info && info[1] > 0 && <span className="build-dots" aria-label={`${t.ui.step} ${info[0]} / ${info[1]}`}>{Array.from({ length: info[1] }, (_, i) => <i key={i} className={i < info[0] ? 'on' : ''} />)}</span>}
        <div className="nav-buttons">
          <button className="button start-button" onClick={() => go(0)} disabled={index === 0} title={`${t.ui.start} (Home)`}><Icon name="first" size={16} /><span>{t.ui.start}</span></button>
          <button className="button prev-button" aria-label={t.ui.prev} title={`${t.ui.prev} (←)`} onClick={prev} disabled={index === 0 && !info?.[0]}><Icon name="back" size={18} /></button>
          <button className="button primary next-button" onClick={next} disabled={index === SLIDES.length - 1} title={`${t.ui.next} (→)`}>{t.ui.next}<Icon name="arrow" size={18} /></button>
        </div>
      </footer>
    </div>

    <dialog ref={notes} className="notes-dialog" onClick={e => { if (e.target === notes.current) notes.current.close(); }}>
      <div className="dialog-header"><span className="eyebrow">{t.ui.notesTitle} · {index + 1} · {plannedStart(SLIDES, index) / 60}–{plannedStart(SLIDES, index) / 60 + slide.minutes} {t.ui.min}</span><button className="icon-button" aria-label={t.ui.close} onClick={() => notes.current.close()}><Icon name="close" /></button></div>
      <h2>{t.slides[slide.id].title}</h2>
      <p>{t.notes[slide.id]}</p>
      <h3>{t.ui.shortcutsTitle}</h3>
      <dl className="shortcut-list">{t.ui.shortcuts.map(([k, v]) => <div key={k}><dt>{k.split(' / ').map(x => <kbd key={x}>{x}</kbd>)}</dt><dd>{v}</dd></div>)}</dl>
      <button className="button primary" onClick={() => notes.current.close()}>{t.ui.back}</button>
    </dialog>
  </div>;
}
