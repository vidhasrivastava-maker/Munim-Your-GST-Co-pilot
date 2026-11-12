import { useEffect, useRef, useState } from "react";
import { Back, Page, StateView } from "../components/Shell";
import { ConnectionState } from "./States";
import { Bee } from "../components/Bee";
import { notice, inr, SAMPLE_NOTICE, lawyer } from "../data";
import { basicExplain, explainNotice, type Explained } from "../explain";

export function NoticeDetail({ back, openExplain, openBrief }: { back: () => void; openExplain: () => void; openBrief: () => void }) {
  return (
    <Page>
      <Back onClick={back} />
      <h1 className="h1">{notice.form} · {notice.title}</h1>
      <p className="sub">Received {notice.received} · reply by {notice.replyBy}</p>
      <div className="card dark"><p className="label">Demanded</p><p className="big-date">{inr(notice.demanded)}</p></div>
      <p className="label" style={{ marginTop: 20 }}>3 claims</p>
      {notice.claims.map((c) => (
        <div className="card" key={c.title} style={{ marginTop: 10 }}>
          <div className="row"><b>{c.title}</b><span className="chip">{inr(c.amount)}</span></div>
          <p className="sub" style={{ marginTop: 6 }}>{c.plain}</p>
        </div>
      ))}
      <button className="btn ink" onClick={openBrief}>Send a brief to {lawyer.name}</button>
      <button className="btn line" onClick={openExplain}>Explain another notice</button>
      <p className="sub" style={{ marginTop: 14, fontSize: 13 }}>munim explains. It never drafts, files, pays or advises — that stays with your lawyer.</p>
    </Page>
  );
}

type S = { k: "idle" } | { k: "loading" } | { k: "ok"; r: Explained } | { k: "short" } | { k: "fail"; why: "offline" | "server" };

export function Explain({ back, online }: { back: () => void; online: boolean }) {
  const [text, setText] = useState("");
  const [s, setS] = useState<S>({ k: "idle" });
  const ctl = useRef<AbortController | null>(null);
  const [slow, setSlow] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => { ctl.current?.abort(); clearTimeout(timer.current); }, []);

  function keepWaiting() { setSlow(false); clearTimeout(timer.current); timer.current = window.setTimeout(() => setSlow(true), 8000); }

  async function run() {
    if (text.trim().length < 40) return setS({ k: "short" });
    if (!online) return setS({ k: "fail", why: "offline" });
    ctl.current?.abort(); ctl.current = new AbortController();
    const hard = window.setTimeout(() => ctl.current?.abort("timeout"), 30000);
    setS({ k: "loading" }); setSlow(false);
    clearTimeout(timer.current); timer.current = window.setTimeout(() => setSlow(true), 8000);
    try { setS({ k: "ok", r: await explainNotice(text, ctl.current.signal) }); }
    catch (e) { if ((e as Error).name === "AbortError" && ctl.current?.signal.reason === "timeout") setS({ k: "fail", why: "server" }); else if ((e as Error).name !== "AbortError") setS({ k: "fail", why: navigator.onLine ? "server" : "offline" }); }
    finally { clearTimeout(timer.current); clearTimeout(hard); setSlow(false); }
  }

  if (s.k === "loading") return slow
    ? <ConnectionState kind="low-connectivity" onPrimary={keepWaiting} onSecondary={run} />
    : <ConnectionState kind="loading" />;
  if (s.k === "fail" && s.why === "offline") return <ConnectionState kind="offline" onPrimary={run} />;

  return (
    <Page>
      <Back onClick={back} />
      <h1 className="h1">Explain a notice</h1>
      <p className="sub">Paste the text of a notice. We'll say it in plain language. Use sample text if you're just trying it out.</p>
      <div style={{ marginTop: 14 }}>
        <textarea value={text} onChange={(e) => { setText(e.target.value); if (s.k === "short") setS({ k: "idle" }); }} aria-label="Notice text" placeholder="Paste notice text here…" />
        <button className="btn line" onClick={() => setText(SAMPLE_NOTICE)}>Use sample notice</button>
        <button className="btn ink" onClick={run}>Explain it</button>
      </div>

      {s.k === "short" && <p className="sub" role="alert" style={{ color: "var(--coral)", marginTop: 10 }}>That's too short to be a notice. Paste the full text.</p>}
      {s.k === "fail" && (
        <div className="card">
          <StateView mood="sorry"
            title="Couldn't read that just now"
            body="Our explainer didn't respond. Nothing was lost."
            note="Nothing was sent to the GST portal or your lawyer.">
            <button className="btn ink" onClick={run}>Try again</button>
            <button className="btn line" onClick={() => setS({ k: "ok", r: basicExplain(text) })}>Show a basic reading</button>
          </StateView>
        </div>
      )}
      {s.k === "ok" && <Result r={s.r} />}
    </Page>
  );
}

function Result({ r }: { r: Explained }) {
  return (
    <div className="card">
      <span className={`chip ${r.source === "ai" ? "mint" : "sun"}`}>{r.source === "ai" ? "Plain-language reading" : "Basic reading (no AI)"}</span>
      <p style={{ marginTop: 10, lineHeight: "22px" }}>{r.summary}</p>
      {r.asks.map((a, i) => <div className="row" key={i} style={{ marginTop: 10 }}><span className="sub">{a.what}</span><b>{a.amount}</b></div>)}
      {r.deadline && <p style={{ marginTop: 12 }}><b>Deadline:</b> {r.deadline}</p>}
      <p className="label" style={{ marginTop: 16 }}>Safe next steps</p>
      <ul className="steps">{r.next.map((n) => <li key={n}>{n}</li>)}</ul>
    </div>
  );
}

export function Brief({ back }: { back: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <Page>
      <Back onClick={back} />
      <h1 className="h1">Brief for {lawyer.name}</h1>
      <p className="sub">What your lawyer will receive. You review it first.</p>
      <div className="card">
        <p><b>{notice.form}</b> · {notice.title}</p>
        <p className="sub">Received {notice.received}, reply by {notice.replyBy}</p>
        <p style={{ marginTop: 10 }}>Demand: <b>{inr(notice.demanded)}</b> across {notice.claims.length} claims.</p>
      </div>
      {sent
        ? <div className="card"><Bee mood="happy" size={90} /><p style={{ textAlign: "center" }}><b>Sent to {lawyer.name}.</b></p></div>
        : <button className="btn mint" onClick={() => setSent(true)}>Send to {lawyer.name}</button>}
    </Page>
  );
}
