import { useEffect, useReducer, useRef } from 'react';
import { agentReducer, initialAgent, presenterAction, needsLookup, TOOLS, DEMO_DATE, STAGE_COUNT, isOverdue } from './engine.js';
import { SlideHead, SimNote } from '../slides/common.jsx';
import Icon from '../components/Icon.jsx';

const PHASE = ['think', 'think', 'act', 'observe', 'act', 'human', 'act', 'human'];
const compact = o => JSON.stringify(o).replace(/"/g, '').replace(/,/g, ', ').replace(/:/g, ': ');

function Stage({ state, dispatch, s, t }) {
  const { step } = state;
  const cat = c => t.categories[c];
  if (step === 0) return <><h3>{s.s0}</h3><dl className="plan">{s.plan.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></>;
  if (step === 1) return <><h3>{s.s1}</h3><div className="tools">{TOOLS.map(x => <div key={x.name} className={`${x.name === 'list_appeals' ? 'chosen' : ''} ${x.risk}`}><code>{x.name}</code><span>{s.toolText[x.name]}</span></div>)}</div></>;
  if (step === 2) return <><h3>{s.s2}</h3>
    <pre className="call-preview">{`list_appeals(as_of: "${DEMO_DATE}", scope: "demo")`}</pre>
    <label className="check-label"><input type="checkbox" checked={state.permission} onChange={e => dispatch({ type: 'PERMISSION', value: e.target.checked })} />{s.permission}</label></>;
  if (step === 3) {
    const lookup = needsLookup(state);
    const fixed = Object.fromEntries(state.overdue.map(r => [r.id, r]));
    return <><h3>{s.s3(state.overdue.length, lookup)}</h3>
      <table className="records"><thead><tr>{['id', 'category', 'due', 'state', 'dept'].map(c => <th key={c}>{s.cols[c]}</th>)}</tr></thead>
        <tbody>{state.records.map(r => { const o = fixed[r.id]; const d = o?.department ?? r.department; return <tr key={r.id} className={isOverdue(r) ? 'overdue' : ''}>
          <td>{r.id}</td><td>{cat(r.category)}</td><td>{r.due}</td><td>{s.states[r.state]}</td>
          <td>{d ? <>{t.dept(d)}{o?.resolved && <em className="found"> · {s.found}</em>}</> : <em className="missing">{s.missing}</em>}</td>
        </tr>; })}</tbody></table>
      {lookup ? <div className="decision"><p>{s.decision} <code>find_responsible</code></p></div> : state.lookupDone && <p className="ok-line"><Icon name="check" size={16} />{s.resolved}</p>}
    </>;
  }
  if (step === 4) return <><h3>{s.s4(state.drafts.length)}</h3><div className="drafts">{state.drafts.map(d => <div key={d.id} className="draft">{s.draft(d, cat(d.category), t.dept(d.to))}</div>)}</div></>;
  if (step === 5) return <><h3>{s.s5}</h3>
    <div className="drafts">{state.drafts.map(d => <label key={d.id} className={`draft approve ${state.selected[d.id] ? 'on' : ''}`}>
      <input type="checkbox" checked={!!state.selected[d.id]} onChange={() => dispatch({ type: 'TOGGLE', id: d.id })} />{s.draft(d, cat(d.category), t.dept(d.to))}
    </label>)}</div>
    <p className="gate-hint">{s.gateHint}</p></>;
  if (step === 6) return state.decision === 'approved'
    ? <><h3>{s.s6a(state.sent.length)}</h3><div className="send-anim">{state.sent.map((id, i) => <span key={id} style={{ animationDelay: `${i * .2}s` }}><Icon name="document" size={16} />{id}</span>)}</div></>
    : <h3>{s.s6r}</h3>;
  return <><h3>{s.s7}</h3><div className="stats">{[state.calls.length, state.lookupDone ? 1 : 0, state.sent.length, state.drafts.length - state.sent.length].map((v, i) => <div key={i}><strong>{v}</strong><small>{s.stats[i]}</small></div>)}</div></>;
}

export default function AgentLab({ t, ctl, onInfo }) {
  const s = t.slides.agentLab;
  const [state, dispatch] = useReducer(agentReducer, initialAgent);
  const ref = useRef(state);
  ref.current = state;
  const logRef = useRef(null);

  useEffect(() => {
    ctl.current = {
      advance: () => { const a = presenterAction(ref.current); if (!a) return false; ref.current = agentReducer(ref.current, a); dispatch(a); return true; },
      retreat: () => false,
    };
    return () => { ctl.current = null; };
  }, []);
  useEffect(() => { onInfo?.([state.step, STAGE_COUNT - 1]); }, [state.step]);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [state.calls.length]);

  const phase = PHASE[state.step];
  return <div className="slide lab-slide">
    <SlideHead s={s}><p className="task"><Icon name="flag" size={18} />{s.task}</p></SlideHead>
    <div className="lab-grid">
      <section className="panel chat-col">
        <div className="panel-label"><Icon name="notes" size={16} />{s.chatLabel}<span className="pill">{s.chatTag}</span></div>
        <div className="bubble">{s.chatReply.map((r, i) => <p key={i}><b>{i + 1}.</b> {r}</p>)}</div>
        <p className="chat-outcome">{s.chatOutcome}</p>
      </section>

      <section className="panel agent-col">
        <div className="panel-label"><Icon name="spark" size={16} />{s.agentLabel}<span className="pill">{state.step + 1} / {STAGE_COUNT}</span></div>
        <ol className="track">{s.stages.map((x, i) => <li key={x} className={`${i < state.step ? 'done' : ''} ${i === state.step ? 'now' : ''}`}><span>{i < state.step ? <Icon name="check" size={11} /> : i + 1}</span><small>{x}</small></li>)}</ol>
        <div className="loop-chips">{Object.entries(s.loop).map(([k, v]) => <span key={k} className={`${k} ${phase === k ? 'on' : ''}`}>{v}</span>)}</div>
        <div className="stage" aria-live="polite"><Stage state={state} dispatch={dispatch} s={s} t={t} /></div>
        {state.error && <p role="alert" className="notice coral">{s.errors[state.error]}</p>}
        <div className="actions">
          {state.step === 5 ? <>
            <button className="button primary" onClick={() => dispatch({ type: 'APPROVE' })}><Icon name="check" size={16} />{s.approve}</button>
            <button className="button reject" onClick={() => dispatch({ type: 'REJECT' })}><Icon name="close" size={16} />{s.reject}</button>
          </> : presenterAction(state) && <button className="button primary" onClick={() => ctl.current?.advance()}>{s.controls.next}<Icon name="arrow" size={16} /></button>}
          <button className="button" onClick={() => dispatch({ type: 'RESET', surprise: state.surprise })}><Icon name="reset" size={16} />{s.controls.reset}</button>
          <label className="check-label small"><input type="checkbox" checked={state.surprise} disabled={state.step > 1} onChange={e => dispatch({ type: 'SURPRISE', value: e.target.checked })} />{s.surprise}</label>
        </div>
      </section>

      <section className="panel dark log-col">
        <div className="panel-label"><Icon name="code" size={16} />{s.logTitle}<span className="pill">{state.calls.length}</span></div>
        <div className="call-list" ref={logRef}>
          {!state.calls.length && <p className="muted">{s.logEmpty}</p>}
          {state.calls.map(c => <div key={c.id} className={`call ${c.status}`}>
            <div><span>#{c.id}</span><code>{c.name}</code><small>{c.status === 'denied' ? s.logStatus.denied : c.name === 'send_notice' ? s.logStatus.sent : s.logStatus.ok}</small></div>
            <pre>{compact(c.args)} → {compact(c.result)}</pre>
          </div>)}
        </div>
        <div className="wf"><p><b>Workflow</b>{s.wfFixed}</p><p className="agent"><b>Agent</b>{s.wfAgent}</p></div>
      </section>
    </div>
    <SimNote t={t} />
  </div>;
}
