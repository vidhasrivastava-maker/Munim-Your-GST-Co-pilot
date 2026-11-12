import { useEffect, useState } from "react";

export type BeeMood = "sorry" | "searching" | "unplugged" | "sleepy" | "happy";

/**
 * Swappable bee slot. Drop Vidha's illustrations into /public/bee/ as
 * sorry.svg, searching.svg, unplugged.svg, sleepy.svg, happy.svg (png also works if you change EXT).
 * Until a file exists, the simple placeholder bee below is shown.
 */
const EXT = "svg";

export function Placeholder({ mood, size }: { mood: BeeMood; size: number }) {
  const eye = mood === "sleepy" ? "M-9 0h6M3 0h6" : mood === "happy" ? "M-9 2q3-5 6 0M3 2q3-5 6 0" : "";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Bee illustration placeholder">
      <ellipse cx="42" cy="38" rx="20" ry="13" fill="#d2c3ff" opacity=".8" transform="rotate(-25 42 38)" />
      <ellipse cx="78" cy="38" rx="20" ry="13" fill="#d2c3ff" opacity=".8" transform="rotate(25 78 38)" />
      <ellipse cx="60" cy="72" rx="34" ry="30" fill="#ffc933" stroke="#16181c" strokeWidth="3" />
      <path d="M36 64q24 8 48 0M33 80q27 10 54 0" stroke="#16181c" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g transform="translate(60 56)" stroke="#16181c" strokeWidth="3" fill="#16181c" strokeLinecap="round">
        {eye ? <path d={eye} fill="none" /> : (<><circle cx="-8" cy="0" r="3.5" /><circle cx="8" cy="0" r="3.5" /></>)}
        {mood === "sorry" && <path d="M-6 12q6-6 12 0" fill="none" />}
        {mood === "unplugged" && <path d="M-6 12h12" fill="none" />}
        {mood === "happy" && <path d="M-6 10q6 7 12 0" fill="none" />}
      </g>
      <path d="M52 40q-6-14-14-16M68 40q6-14 14-16" stroke="#16181c" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Bee({ mood, size = 140 }: { mood: BeeMood; size?: number }) {
  // Placeholder is the default; the real illustration replaces it only after it has loaded successfully.
  const [loaded, setLoaded] = useState(false);
  const src = `/bee/${mood}.${EXT}`;
  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.src = src;
    return () => { img.onload = null; };
  }, [src]);
  if (!loaded) return <Placeholder mood={mood} size={size} />;
  return <img src={src} width={size} height={size} alt="" aria-hidden="true" style={{ objectFit: "contain", display: "block", margin: "0 auto" }} />;
}

export type MunimArt = "offline" | "low-connectivity" | "connected" | "loading" | "disconnected";
const fallbackMood: Record<MunimArt, BeeMood> = { offline: "unplugged", "low-connectivity": "sorry", connected: "happy", loading: "searching", disconnected: "unplugged" };

/** Munim illustrations exported from Figma into /public/munim/<name>.png. Falls back to the placeholder until the file exists. */
export function MunimIllustration({ art, size = 300 }: { art: MunimArt; size?: number }) {
  const [loaded, setLoaded] = useState(false);
  const src = `/munim/${art}.png`;
  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.src = src;
    return () => { img.onload = null; };
  }, [src]);
  if (!loaded) return <Placeholder mood={fallbackMood[art]} size={Math.min(size, 160)} />;
  return <img src={src} alt="" aria-hidden="true" style={{ display: "block", margin: "0 auto", width: size, maxWidth: "100%", height: "auto" }} />;
}
