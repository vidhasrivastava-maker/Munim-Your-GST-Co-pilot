import { useState } from "react";
import { Page, StateView } from "../components/Shell";
import { lawyer } from "../data";

export function Lawyer() {
  return (
    <Page>
      <h1 className="h1">Your lawyer</h1>
      <div className="card"><b>{lawyer.name}</b><p className="sub">{lawyer.city} · handles your DRC-01 case</p>
        <button className="btn ink">Message {lawyer.name}</button></div>
    </Page>
  );
}

type Up = { name: string; state: "ok" | "fail" };
export function Vault({ online }: { online: boolean }) {
  const [files, setFiles] = useState<Up[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  function pick(list: FileList | null) {
    if (!list?.length) return;
    const f = list[0];
    const okType = /pdf|png|jpe?g/i.test(f.type) || /\.(pdf|png|jpe?g)$/i.test(f.name);
    if (!online) { setFiles((x) => [...x, { name: f.name, state: "fail" }]); return setMsg("You're offline. Upload didn't go through."); }
    if (!okType) { setFiles((x) => [...x, { name: f.name, state: "fail" }]); return setMsg("We can only read PDF, PNG or JPG files."); }
    if (f.size > 10 * 1024 * 1024) { setFiles((x) => [...x, { name: f.name, state: "fail" }]); return setMsg("That file is over 10 MB."); }
    setMsg(null); setFiles((x) => [...x, { name: f.name, state: "ok" }]);
  }
  return (
    <Page>
      <h1 className="h1">Vault</h1>
      <p className="sub">Your notices and invoices, kept safe in one place.</p>
      <label className="btn mint" style={{ display: "grid", placeItems: "center", cursor: "pointer" }}>
        Add a document<input type="file" hidden onChange={(e) => pick(e.target.files)} />
      </label>
      {msg && <p className="sub" role="alert" style={{ color: "var(--coral)", marginTop: 10 }}>{msg}</p>}
      {files.length === 0
        ? <div className="card"><StateView mood="sleepy" title="Nothing here yet" body="Add a notice or invoice and it will show up here." /></div>
        : files.map((f, i) => (
          <div className="card row" key={i}><span>{f.name}</span>
            {f.state === "ok" ? <span className="chip mint">Saved</span>
              : <span><span className="chip coral">Failed</span> <button onClick={() => setFiles((x) => x.filter((_, j) => j !== i))} aria-label="Remove">✕</button></span>}
          </div>))}
      <p className="sub" style={{ marginTop: 16, fontSize: 13 }}>Prototype: files stay on this device and aren't uploaded anywhere.</p>
    </Page>
  );
}
