# Chicago TreeDex — Architecture

Oct 3, 2026 · @Bill

## Summary

TreeDex is a personal iPhone web app. A kid photographs a tree, the app identifies it, and the tree is "caught" into a collectible dex of Chicago-area species. It runs at $0 per month, with no server, no accounts and no App Store.

| Decision | Choice | Why |
| --- | --- | --- |
| Platform | Web app installed to the home screen (PWA) | Camera, offline use and a home-screen icon all work on iOS; skips Apple's $99/yr developer account and App Review |
| Identification | Pl@ntNet API, free tier | Free up to 500 identifications a day for personal use; trained on plants, so it beats a general vision model on look-alikes |
| Species scope | Curated Chicago list | A finite list makes the dex collectible and filters out wrong matches |
| Content | Written once in Claude Code, stored as JSON | No per-photo cost; you review every entry before the kids see it |
| Data | On the phone only (IndexedDB) | No accounts; the kids' photos and locations never leave the device |
| Hosting | Static site on GitHub Pages | Free, and HTTPS, which the camera and PWA features require |

Sources: [Pl@ntNet API pricing](https://my.plantnet.org/pricing), [Pl@ntNet API terms](https://my.plantnet.org/terms_of_use)

## System architecture

&#91;embedded content: TreeDex architecture · phone app, one external API, static hosting\]

The phone holds the app, the catalog and every catch. The only runtime network call is the photo going to Pl@ntNet; GitHub Pages just serves the app files.

## Identification pipeline

The app sends the photo to Pl@ntNet, then only accepts answers that are on the Chicago list. Anything else becomes a "mystery tree" instead of a wrong answer.

1. **Pick what you're photographing.** Big buttons: Leaf, Bark, Seed or nut, Flower. Pl@ntNet takes this as an organ hint, which improves accuracy.
2. **Take the photo.** A native camera input (`<input type="file" accept="image/*" capture="environment">`). Compress on the phone before upload and storage. Pl@ntNet resizes to 1280px on the short side anyway, so larger uploads gain nothing.
3. **Identify.** POST the image and organ to Pl@ntNet's `/v2/identify` endpoint. Allow an optional second photo (leaf plus bark) for hard cases.
4. **Filter to the list.** Match the ranked results by scientific name against the species catalog. If only the genus matches, fall back to "Some kind of oak!"
5. **Decide what the kid sees.**
   - Strong in-list match: the catch reveal.
   - Close call: two or three candidate cards side by side, and the kid picks which leaf matches. This is the main learning moment.
   - No in-list match: save as a mystery tree and suggest another angle.
6. **No signal:** queue the photo and identify it when the phone is back online.

Score thresholds for "strong" and "close call" should be tuned against 20–30 real photos in Phase 1, not guessed.

**API key handling.** Pl@ntNet supports calling the API straight from the browser: you list the app's domains under "Authorized domains" and expose the key. No backend is needed. A free Cloudflare Worker proxy is the fallback if that setup proves unreliable. Free use asks for a Pl@ntNet credit, which goes on an About screen.

Source: [Pl@ntNet API getting started](https://my.plantnet.org/doc/getting-started/introduction)

## Data model

There are two stores. A read-only species catalog ships with the app. The family's catches live in IndexedDB on the phone. Badges and progress are computed from catches, never stored.

**Species catalog** (`species.json`, bundled, one entry per tree):

| Field | Example | Notes |
| --- | --- | --- |
| `id` | `bur-oak` | Slug, stable forever |
| `commonName`, `scientificName` | Bur Oak, *Quercus macrocarpa* | Scientific name is the match key for Pl@ntNet |
| `genus`, `family` | Quercus, Fagaceae | Powers the genus fallback and "oak hunter" badges |
| `native` | true | Native vs. planted street tree |
| `rarity` | common / uncommon / rare / legendary | Drives card styling and points |
| `leafType`, `leafShape` | simple, lobed | Picks the leaf-shape icon |
| `fallColor`, `size` | yellow-brown, 70–80 ft | Card stats |
| `funFacts`, `whoLivesHere` | short kid-level lines | The educational content |
| `lookalikes` | `[{id, howToTell}]` | Shown on close-call screens |
| `winterClues` | bark, buds, seeds | Supports identification after the leaves drop |

**Catch** (IndexedDB, one per photo):

| Field | Notes |
| --- | --- |
| `id`, `capturedAt` |  |
| `speciesId` | `null` for a mystery tree; can be filled in later |
| `catcher` | Which kid caught it |
| `photo` | Compressed blob; the first catch's photo becomes the species' card art |
| `organ` | leaf, bark, seed, flower |
| `location`, `placeLabel` | Optional GPS plus a kid-friendly name like "the park by school" |
| `candidates` | Snapshot of Pl@ntNet's top three results, for re-checking later |
| `confirmedBy` | `app` or `kid-pick` |

**Profiles** (IndexedDB): a name and an avatar per kid, so two kids can share one phone's dex and compete.

## Content pipeline

Claude Code writes every dex entry directly into `species.json` as part of development. That uses your existing subscription instead of the API, so it costs nothing extra. You review the diff like any other code change.

1. **Build the species list.** Start from regional sources such as the Morton Arboretum's tree guides and the Chicago Region Trees Initiative. Include common planted street trees (honey locust, ginkgo, Norway maple) along with natives, since that is what kids will actually find on the block.
2. **Generate entries.** Fun facts, who lives in the tree, look-alikes and winter clues, written at the kids' reading level.
3. **Fact-check.** Have Claude Code check each entry against an arboretum or extension page and record the URL in a `sources` field. You spot-check the rare and legendary tiers.
4. **Art.** No downloaded images. Each card uses one of about a dozen simple leaf-shape icons (lobed, palmate, compound, needle and so on) until a kid catches that tree. After that, the kid's own first photo becomes the card art.

## Kid UX and game mechanics

The core loop is short: point, catch, reveal, add to the dex. Everything else is a reason to go outside again.

**Screens (v1)**

| Screen | What it does |
| --- | --- |
| Home | Dex progress ("23 of the Chicago list"), a big Catch button, this week's quest |
| Catch | Organ picker, then the camera |
| Reveal | Card-flip animation, rarity color, first fun fact read aloud |
| Close call | Two or three candidate cards: "Which leaf looks like yours?" |
| Dex | Grid of every species; uncaught trees show only a silhouette and "???" |
| Species card | Kid's photo, stats, fun facts, look-alikes, where and when it was caught |
| Profiles | Switch between kids; each has a dex and a badge shelf |

**Mechanics**

- **Rarity tiers** set card colors and points. Silver maple is common; a giant bur oak is legendary.
- **Badges** are computed from catches: First Catch, Oak Hunter (three oak species), Four Seasons (the same tree in every season), Leaf Shapes Set.
- **Seasonal quests** rotate weekly from a fixed list, such as "find three trees with red fall color."
- **Re-catches** add photos to that tree's album instead of being wasted.

**Kid-proofing rules**

- No percentages or confidence scores anywhere.
- A read-aloud button on every card, using the browser's built-in speech (works offline, no cost), for kids who don't read yet.
- Big tap targets and no free-text input.
- Nothing is shared or posted outside the phone.

## iPhone web-app constraints

A home-screen web app is the right call here. The one real risk is local storage, which gets a backup feature in v1.

| Constraint | Impact | Mitigation |
| --- | --- | --- |
| Storage can be cleared | iOS may purge web app data under storage pressure, which would wipe the kids' dex | Request persistent storage; add Export/Import of a backup file in v1; compress photos |
| No cross-device sync | Each phone has its own dex | Fine for v1; optional sync later on a free tier (Cloudflare D1 or similar) |
| No install prompt | iOS never offers to install | One-time manual "Add to Home Screen" from Safari's share menu |
| Identification needs signal | Pl@ntNet runs online only | App shell, catalog and dex all work offline; photos queue until online |
| Camera | The native picker works in home-screen apps | Use the file input, not a custom live viewfinder |
| Separate storage | The home-screen app does not share data with Safari tabs | Always test from the installed icon, not a Safari tab |

The storage-eviction behavior is worth a quick check in Phase 1, since Apple's rules have changed across iOS versions.

## Hosting, cost and stack

The recurring cost is $0. The only optional spend is a custom domain.

| Item | Choice | Cost |
| --- | --- | --- |
| Framework | Vite + React + TypeScript | $0 |
| PWA layer | vite-plugin-pwa (manifest, service worker, offline cache) | $0 |
| Local database | IndexedDB via the `idb` wrapper | $0 |
| Identification | Pl@ntNet free tier (500 identifications/day) | $0 |
| Read-aloud | Browser Web Speech API | $0 |
| Hosting | GitHub Pages, deployed by GitHub Actions on push | $0 |
| Content writing | Claude Code on your existing plan | $0 extra |
| Custom domain | Optional; `*.github.io` works fine | Optional |

Pl@ntNet's authorized domains must match the exact origins, so add both the `github.io` URL and `localhost` for development.

## Build phases and Claude Code handoff

Hand off to Claude Code now. Skip a separate mockup here; the UI is better designed in Claude Code against real data and tested on your phone. Phase 1 is deliberately ugly, because its job is to prove identification works before any game is built on it.

1. **Setup (you, about 15 minutes).** Create a Pl@ntNet account and key, add authorized domains, and create the GitHub repo.
2. **Phase 1: accuracy spike.** Camera, then Pl@ntNet, then raw results on screen. Take 20–30 photos of real neighborhood trees. **Gate:** common trees identify correctly from leaf photos, or the plan changes before anything else is built.
3. **Phase 2: catalog.** Species list, `species.json` with generated content, and the leaf-shape icons.
4. **Phase 3: core loop.** Catch, reveal, close-call picker, dex grid, species card, kid profiles, IndexedDB, and Export/Import backup.
5. **Phase 4: game layer.** Rarity, badges, quests, read-aloud. Visual polish happens here.
6. **Phase 5: winter mode and offline.** Bark, bud and seed flows, plus the offline photo queue.

**How to hand off**

- Export this doc as Markdown and commit it to the repo as `ARCHITECTURE.md`.
- Ask Claude Code to create a `CLAUDE.md` from it, then start on Phase 1 only.
- Run each phase as its own session, and check the result on your phone before starting the next.

## Open questions

- [ ] Kids' ages and reading level: this sets the tone of the copy and whether read-aloud is on by default.
- [ ] One shared dex per phone, or a separate dex per kid?
- [ ] Does any Pl@ntNet regional flora outperform the global one for Illinois? Check the API's projects list in Phase 1.
- [ ] How big should the list be? A smaller list is easier to finish; a bigger one lasts longer.
- [ ] Should invasive trees (Callery pear, tree of heaven) get a "trouble tree" label? It's a good teaching angle.
- [ ] Is a phone-to-phone sync worth adding later, or is backup/export enough?
