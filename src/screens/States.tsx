import { Page, StateView } from "../components/Shell";
import { lawyer } from "../data";

export const STATE_KEYS = ["offline", "low-connectivity", "connected", "loading", "disconnected"] as const;
export type StateKey = (typeof STATE_KEYS)[number];

type Props = { kind: StateKey; onPrimary?: () => void; onSecondary?: () => void; title?: string; body?: string };

/** Full-screen connection states. Copy and layout match the Figma "Cover" page screens (no bottom nav). */
export function ConnectionState({ kind, onPrimary, onSecondary, title, body }: Props) {
  const art = kind;
  return (
    <Page center>
      {kind === "offline" && (
        <StateView art={art} title="You're offline" body="Check your internet and try again. Your saved records are still here, and nothing was lost.">
          <button className="btn ink" onClick={onPrimary}>Try again</button>
        </StateView>)}
      {kind === "low-connectivity" && (
        <StateView art={art} title="Slow connection" body="This is taking longer than usual. We'll keep trying in the background.">
          <button className="btn ink" onClick={onPrimary}>Keep waiting</button>
          <button className="btn line" onClick={onSecondary}>Try again</button>
        </StateView>)}
      {kind === "connected" && (
        <StateView art={art} title="Portal connected" body="Last checked just now. We'll tell you as soon as a new notice, hearing or order arrives.">
          <button className="btn ink" onClick={onPrimary}>Back to home</button>
        </StateView>)}
      {kind === "loading" && (
        <div aria-busy="true"><StateView art={art} title={title ?? "Reading your notice…"} body={body ?? "This usually takes a few seconds. Please keep the app open."} /></div>)}
      {kind === "disconnected" && (
        <StateView art={art} title="Portal disconnected" body="We can't reach your GST portal. New notices, hearings or orders may be missing. Your saved records are safe.">
          <button className="btn ink" onClick={onPrimary}>Reconnect</button>
          <button className="btn line" onClick={onSecondary}>Talk to {lawyer.name}</button>
        </StateView>)}
    </Page>
  );
}
