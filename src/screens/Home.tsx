import { business, hearing, notice, upcoming, inr } from "../data";
import { Page } from "../components/Shell";

export function Home({ openNotice, portalDown, openPortal }: { openNotice: () => void; portalDown: boolean; openPortal: () => void }) {
  return (
    <Page>
      <p className="label">{business.name}</p>
      <h1 className="h1">One notice needs you</h1>
      {portalDown && (
        <button className="card alert" style={{ width: "100%", textAlign: "left" }} onClick={openPortal}>
          <span className="chip coral">Not connected</span>
          <p className="sub" style={{ marginTop: 8 }}>We can't reach your GST portal. New notices may be missing. Tap to fix.</p>
        </button>
      )}
      <div className="card dark">
        <p className="label">Reply by</p>
        <p className="big-date">{notice.replyBy}</p>
        <p className="sub">{notice.form} · {notice.title} · {inr(notice.demanded)} demanded</p>
        <button className="btn mint" onClick={openNotice}>See what it means</button>
      </div>
      <div className="card">
        <p className="label">Hearing</p>
        <p style={{ fontWeight: 700, fontSize: 20, marginTop: 4 }}>{hearing.date}, {hearing.time}</p>
        <p className="sub">{hearing.form} · Adv. Rao will attend with you</p>
      </div>
      <div className="card">
        <p className="label">Coming up</p>
        {upcoming.map((u) => (
          <div className="row" key={u.label} style={{ marginTop: 10 }}><span>{u.label}</span><span className="chip sun">{u.date}</span></div>
        ))}
      </div>
    </Page>
  );
}
