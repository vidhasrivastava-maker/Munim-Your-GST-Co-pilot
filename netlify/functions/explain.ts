// Server-side only: the Anthropic key lives in the ANTHROPIC_API_KEY env var on Netlify, never in the browser.
const SYSTEM = `You explain Indian GST notices in plain, calm language for small-business owners.
You NEVER draft replies, file anything, make payments, or give legal/tax advice. If asked, say to talk to their lawyer.
Return ONLY JSON: {"summary": string (max 2 sentences), "asks": [{"what": string, "amount": string}], "deadline": string|null, "next": string[] (max 3, safe steps like "share with your lawyer")}.`;

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "not_configured" }), { status: 503 });
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (!text || text.length < 20 || text.length > 8000) return new Response(JSON.stringify({ error: "bad_input" }), { status: 400 });
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: process.env.MUNIM_MODEL ?? "claude-sonnet-4-5", max_tokens: 700, system: SYSTEM, messages: [{ role: "user", content: text }] }),
    });
    if (!r.ok) return new Response(JSON.stringify({ error: "upstream" }), { status: 502 });
    const j = (await r.json()) as { content: { text: string }[] };
    const raw = j.content?.[0]?.text ?? "";
    const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
    return new Response(JSON.stringify(parsed), { headers: { "content-type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "parse" }), { status: 502 });
  }
};
