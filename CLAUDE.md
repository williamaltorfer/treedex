# TreeDex

Personal iPhone web app: a kid photographs a tree, Pl@ntNet identifies it, and the tree gets "caught" into a collectible dex of Chicago-area species. $0/month, no server, no accounts, no App Store. Full rationale and open questions: `ARCHITECTURE.md`.

## Stack

- Vite + React + TypeScript, deployed as a PWA (`vite-plugin-pwa`, added in Phase 3+)
- No backend. Pl@ntNet is called directly from the browser (authorized domains, not a proxy) unless that proves unreliable
- Data lives on-device only: IndexedDB via the `idb` wrapper for catches/profiles; `species.json` bundled read-only catalog
- Hosting: GitHub Pages via GitHub Actions on push
- `VITE_PLANTNET_API_KEY` in `.env.local` (gitignored) — see `.env.local.example`

## Build phases (do not skip ahead)

1. **Accuracy spike.** Camera → Pl@ntNet → raw results on screen. Gate (still not formally run): common trees identify correctly from leaf photos against 20-30 real neighborhood photos. Match-score thresholds in `src/match.ts` are placeholders pending that test.
2. **Catalog.** Species list + `species.json` with generated content + leaf-shape icons. Now 28 species, grouped into 5 regions, checked against a real neighborhood reference list.
3. **Core loop.** Catch, reveal, close-call picker, dex grid, species card, kid profiles, IndexedDB, Export/Import backup.
4. **Game layer.** Rarity, badges, quests, read-aloud, visual polish, XP levels (Seed → Ancient Oak).
5. **Winter mode + offline (current).** Seasonal bark/seed tip on Catch, winter-clue hints in the close-call picker when the organ is bark/fruit, and offline photo queue reconciliation (`src/offlineQueue.ts`) that re-identifies queued catches automatically once back online.

Run each phase as its own session; check the result on the phone before starting the next. Species cards also pull a real tree photo from Wikipedia's REST API at runtime (`src/wikipedia.ts`) — a deliberate, confirmed exception to the "no downloaded art" rule below, since the user is fine with the app requiring a network connection.

## Rules

- No percentages or confidence scores shown to kids (fine to show in Phase 1 dev UI, must be gone before Phase 3).
- No free-text input in the kid-facing app; big tap targets only.
- Nothing is shared or posted outside the phone — no accounts, no analytics beacons.
- Match species by `scientificName` against Pl@ntNet's result; fall back to genus-only "Some kind of oak!" when only the genus matches.
- Always test from the installed home-screen icon, not a Safari tab — the home-screen app has separate storage.
- Use the native file input camera (`<input type="file" accept="image/*" capture="environment">`), not a custom viewfinder.
