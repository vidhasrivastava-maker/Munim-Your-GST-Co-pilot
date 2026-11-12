# munim — A GST Co-Pilot
A GST compliance copilot for Indian small-business owners. It **explains** notices in plain language and helps the owner brief their lawyer. It **never** drafts replies, files, pays or gives advice.

> Concept project by Vidha Srivastava (NIFT B.Des, Fashion Communication). Not launched, all notices and numbers are fictional samples.

## What works
- Home, notice detail (3 claims), brief for lawyer, Lawyer and Vault tabs, GST-portal-disconnected flow
- **Notice explainer**: paste text → plain-language summary, amounts, deadline, safe next steps
- **Connection states** (Munim illustrations, copy from the Figma screens): loading, slow connection (after 8s), offline, portal disconnected, portal connected. Preview any with `?state=offline|low-connectivity|connected|loading|disconnected`
- **Other error states**: explainer failure (+ "basic reading" fallback), too-short input, failed/unsupported/oversized upload, empty vault
- Reconnect is a demo (simulated ~1.5s check); the real flow would verify an OTP with the portal

## Stack
React 18 + TypeScript + Vite · plain CSS with design tokens from the Figma file · Netlify Function calling the Claude API (key stays server-side) · Noto Sans + Urbanist.

## Run
```bash
npm install
npm run dev        # UI only; explainer falls back to the error state locally
npm test           # unit tests for the offline reading
npm run build
```
For the AI explainer locally use `npx netlify dev` with `ANTHROPIC_API_KEY` set in your shell or a git-ignored `.env`.

## Deploy (Netlify)
Connect the repo; build `npm run build`, publish `dist`. In Site settings → Environment variables add `ANTHROPIC_API_KEY` (never commit it). Optional: `MUNIM_MODEL`.

## Illustrations
Munim illustrations live in `public/munim/` (`offline`, `low-connectivity`, `connected`, `loading`, `disconnected`, transparent PNG). If a file is missing, a simple placeholder bee is shown. The `?state=` preview and the full-screen states hide the bottom nav, as in the Figma frames.

## Decisions & what I'd do next
*(Vidha: fill this in with your own words — what you chose, what you cut, what didn't work.)*
