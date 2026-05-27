# Working agreement — Adventure Planner

## Always do

1. **Keep `GUIDE.md` in sync with code changes.** This is non-negotiable. When you change a feature, add a tab, alter a localStorage key, modify a prompt, or fix a critical bug — update the matching section of `GUIDE.md` AND add a Changelog entry. Same commit as the code. The guide's § 14 *Self-maintenance protocol* lists the triggers.

2. **Run `npx tsc -b` and `npx eslint src/` before claiming a task done.** The auto-commit hook also gates on `tsc -b`, but verify yourself first.

3. **Verify behaviour, don't just verify compilation.** "tsc passes" ≠ "feature works." For UI changes, do a runtime walk in the Claude_Preview server (`mcp__Claude_Preview__preview_start` → `holiday-dev`) and probe via `preview_eval` (DOM is authoritative; screenshots are unreliable per past lessons).

4. **Stop-propagation on every interactive button inside a clickable card.** Multiple bugs have come from buttons inside `motion.button`/clickable divs. Always:
   - Card root: `<motion.div role="button" tabIndex={0} onKeyDown={Enter|Space}>` (NOT `<button>`).
   - Inner buttons: `onClick={(e) => { e.stopPropagation(); ... }}`.
   - Wrapper containing buttons: `onClick={(e) => e.stopPropagation()}` belt-and-suspenders.

5. **Guard `.length` / `.toLowerCase` / `.toUpperCase` on every LLM-returned optional field.** The LLM omits fields ~5% of the time. Pattern: `(field || '').toLowerCase()` or `field && field.length > 0`.

## Never do

1. **Don't add an unlayered `* {}` rule.** Tailwind v4 utilities are in `@layer utilities` — unlayered selectors beat them regardless of specificity. Use `@layer base` or a class selector instead.

2. **Don't use `window.confirm` / `window.alert` for in-app actions.** On touch devices the dismiss fires a ghost-click that lands on whatever is behind the button. Use an inline two-step confirm UI (see MyTrips delete pattern).

3. **Don't commit secrets.** `.env` is gitignored and must stay so. If a key appears anywhere outside `.env`, it's compromised — rotate it.

## Project-specific facts

- **Port for dev preview:** `5199` (not 5173 — that's another project's). Defined in `.claude/launch.json`.
- **Build command:** `tsc -b && vite build`. Vercel uses this.
- **State race fixed:** when wizard calls `onUpdate(data)` then `onGenerate()` synchronously, `handleGenerate` in `App.tsx` accepts a `data` override so it doesn't read stale state. Preserve this pattern when adding new wizard fields.
- **LLM provider failover:** `server/lib/gemini.ts` tries Gemini → OpenAI → Anthropic → OpenRouter → Groq → Together → Ollama. Order is cost/speed-optimised, not capability-optimised.
- **Saved trips cap:** 30 per device (`tripStore.saveTrip` slices). When you add fields to `TravelConfig`, make them optional (`field?:`) so old saved trips still load.

## Useful entry points

- `GUIDE.md` — the user & admin manual (always current).
- `src/types/index.ts` — every shared shape lives here.
- `api/[route].ts` — the only Vercel function; all routes dispatch from this file.
- `server/lib/prompts.ts` — all LLM system prompts.
- `src/App.tsx` — root state container and view router.
