import type { ReactNode } from "react";
import { Bee, MunimIllustration, type BeeMood, type MunimArt } from "./Bee";

export type Tab = "home" | "cases" | "lawyer" | "vault";
const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" }, { id: "cases", label: "Cases", icon: "▤" },
  { id: "lawyer", label: "Lawyer", icon: "☺" }, { id: "vault", label: "Vault", icon: "▣" },
];

export function StatusBar() {
  return <div className="status" aria-hidden="true"><span>9:41</span><span>●●● ▮</span></div>;
}
export function Nav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="nav" aria-label="Main">
      {tabs.map((t) => (
        <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => onTab(t.id)} aria-current={tab === t.id ? "page" : undefined}>
          <span className="dot">{t.icon}</span>{t.label}
        </button>
      ))}
    </nav>
  );
}
export function Back({ onClick }: { onClick: () => void }) {
  return <button className="back" onClick={onClick} aria-label="Back">←</button>;
}
export function Page({ children, center }: { children: ReactNode; center?: boolean }) { return <div className={center ? "scroll center" : "scroll"}>{children}</div>; }

/** Shared error / empty state: bee + calm message + what is safe + actions. */
export function StateView(p: { mood?: BeeMood; art?: MunimArt; title: string; body: string; note?: string; children?: ReactNode }) {
  return (
    <div className="state" role="status">
      {p.art ? <MunimIllustration art={p.art} /> : <Bee mood={p.mood ?? "sorry"} />}
      <h2>{p.title}</h2>
      {p.body && <p className="sub">{p.body}</p>}
      {p.children && <div className="actions">{p.children}</div>}
      {p.note && <p className="sub" style={{ marginTop: 14, fontSize: 13 }}>{p.note}</p>}
    </div>
  );
}
