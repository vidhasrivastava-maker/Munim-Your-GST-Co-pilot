export type Explained = { summary: string; asks: { what: string; amount: string }[]; deadline: string | null; next: string[]; source: "ai" | "basic" };

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Offline fallback: pulls amounts and day-counts from the text with simple rules. Never advises or files. */
export function basicExplain(text: string): Explained {
  const t = clean(text);
  const amounts = [...t.matchAll(/(?:\brs\.?|₹)\s?(\d[\d,]*)/gi)].map((m) => m[1]);
  const days = t.match(/within\s+(\d+)\s+days/i)?.[1] ?? null;
  const asks = amounts.map((a, i) => ({ what: i === amounts.length - 1 && amounts.length > 1 ? "Total amount mentioned" : "Amount mentioned", amount: "₹" + a }));
  return {
    summary: asks.length ? "This looks like a notice from the GST department that mentions money you may owe. Read it with your lawyer before replying." : "This looks like a notice from the GST department. We couldn't pick out amounts from the text.",
    asks,
    deadline: days ? `Reply within ${days} days of receiving it` : null,
    next: ["Check the reply date on the notice itself", "Share it with your lawyer", "Don't pay or reply until you've spoken to them"],
    source: "basic",
  };
}

export async function explainNotice(text: string, signal?: AbortSignal): Promise<Explained> {
  const res = await fetch("/.netlify/functions/explain", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }), signal,
  });
  if (!res.ok) throw new Error(`explain failed: ${res.status}`);
  const data = (await res.json()) as Omit<Explained, "source">;
  return { ...data, source: "ai" };
}
