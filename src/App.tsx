import { useEffect, useRef, useState } from "react";
import { Nav, StatusBar, type Tab } from "./components/Shell";
import { Home } from "./screens/Home";
import { Brief, Explain, NoticeDetail } from "./screens/Notice";
import { Lawyer, Vault } from "./screens/Other";
import { ConnectionState, STATE_KEYS, type StateKey } from "./screens/States";

type Route = "tab" | "notice" | "explain" | "brief" | "portal";
type Stage = "idle" | "checking" | "slow" | "ok";
const previewKey = (() => { const v = new URLSearchParams(location.search).get("state"); return (STATE_KEYS as readonly string[]).includes(v ?? "") ? (v as StateKey) : null; })();

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [route, setRoute] = useState<Route>("tab");
  const [online, setOnline] = useState(navigator.onLine);
  const [portalDown, setPortalDown] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const timers = useRef<number[]>([]);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clearTimers, []);

  // Demo reconnect: the real flow would verify an OTP with the GST portal. Here it "checks" for ~1.5s.
  // If the browser is slow to confirm (>8s, e.g. throttled network) the slow-connection state appears.
  function reconnect() {
    clearTimers(); setStage("checking");
    timers.current.push(window.setTimeout(() => setStage((s) => (s === "checking" ? "slow" : s)), 8000));
    timers.current.push(window.setTimeout(() => {
      if (!navigator.onLine) { setStage("idle"); return; }
      setPortalDown(false); setStage("ok"); clearTimers();
    }, 1500));
  }

  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    addEventListener("online", on); addEventListener("offline", off);
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }, [toast]);

  useEffect(() => {
    const onPop = () => { clearTimers(); setStage("idle"); setRoute((r) => (r === "tab" ? r : r === "brief" || r === "explain" ? "notice" : "tab")); };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);
  const go = (r: Route) => { history.pushState({ r }, ""); setRoute(r); };
  const home = () => { setTab("home"); setRoute("tab"); };
  let body;
  if (previewKey) return <div className="stage"><div className="phone"><StatusBar /><ConnectionState kind={previewKey} /></div></div>;
  if (route === "notice") body = <NoticeDetail back={home} openExplain={() => go("explain")} openBrief={() => go("brief")} />;
  else if (route === "explain") body = <Explain back={() => setRoute("notice")} online={online} />;
  else if (route === "brief") body = <Brief back={() => setRoute("notice")} />;
  else if (route === "portal") {
    const leave = () => { clearTimers(); setStage("idle"); home(); };
    if (!online) body = <ConnectionState kind="offline" onPrimary={() => { if (navigator.onLine) reconnect(); else setToast("Still offline. Try again when you're connected."); }} />;
    else if (stage === "checking") body = <ConnectionState kind="loading" title="Checking your portal…" body="This usually takes a few seconds. Please keep the app open." />;
    else if (stage === "slow") body = <ConnectionState kind="low-connectivity" onPrimary={() => setStage("checking")} onSecondary={reconnect} />;
    else if (stage === "ok") body = <ConnectionState kind="connected" onPrimary={leave} />;
    else body = <ConnectionState kind="disconnected" onPrimary={reconnect} onSecondary={() => { setStage("idle"); setTab("lawyer"); setRoute("tab"); }} />;
  }
  else if (tab === "home") body = <Home openNotice={() => go("notice")} portalDown={portalDown} openPortal={() => go("portal")} />;
  else if (tab === "lawyer") body = <Lawyer />;
  else if (tab === "vault") body = <Vault online={online} />;
  else body = <NoticeDetail back={() => setTab("home")} openExplain={() => go("explain")} openBrief={() => go("brief")} />;

  return (
    <div className="stage"><div className="phone">
      <StatusBar />
      {!online && <div className="toast" role="status">You're offline. Saved records still work.</div>}
      {toast && online && <div className="toast" role="status">{toast}</div>}
      {body}
      <Nav tab={tab} onTab={(t) => { setTab(t); setRoute("tab"); }} />
      <div className="home-ind" />
    </div></div>
  );
}
