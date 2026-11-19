# Leonida Ledger — GTA VI trophy guide & tracker

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

[![rank](https://make.fun/badge/gta6-trophy-guide-01/sandiawan-kielo-dale/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)

[![reward](https://make.fun/badge/gta6-trophy-guide-01/sandiawan-kielo-dale/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI, built for the make.fun bounty "Build the best GTA 6 trophy guide". Plain static files, no build step, no network requests.

## Features

- **Checklist of all 55 trophies** with the official name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PSN).
- **A guide for every trophy**, written in our own words, with its sources linked beside it and a confidence badge: *Cited guide*, *Partly confirmed*, or *Unsolved · description-based* for the few trophies nobody had solved at launch.
- **Roadmap to the platinum** in five ordered stages (story, side questlines, 100% checklist, Strangers & Freaks clean-up, platinum), each trophy placed in chapter order.
- **Missables & windows**: the one possibly missable trophy (Positive Mental Attitude, Chapter 1 balcony meditation), Lucia-only / Jason-only / partner gates, and a chapter timeline of when each trophy first becomes possible.
- **Tracker**: progress saved in `localStorage`, export to a `.json` file and import it back.
- **Filters** by kind (story, missable, collectibles, activities, side quests, robbery & crime, feats, online — the game lists none), grade and earned state, plus a search box.
- **Spoiler shield**: hides the names and descriptions of story trophies (or all 28 hidden ones) until earned, with a one-off reveal.
- **Progress stats**: earned count, PSN points and a bar per grade.

## Usage

```sh
node serve.ts            # serves app/ on http://localhost:8080
```

Open the page in desktop Chrome. Any static server with `app/` at its root works too. To hand the entry in:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output and writes `dossier.json` with the vendored make.fun library.

## Layout

- `app/index.html` — page shell
- `app/js/` — one module per job: `main.js` (boot and wiring), `trophy-data.js`, `progress-store.js`, `progress-transfer.js`, `trophy-filters.js`, `spoiler-shield.js`, `stats-panel.js`, `trophy-badges.js`, `checklist-view.js`, `guide-panel.js`, `roadmap-view.js`, `missables-view.js`, `dom.js`
- `app/css/` — `theme.css`, `layout.css`, `views.css`
- `app/data/trophies.json` — trophies, guides, roadmap stages and the source registry

## Sources policy

Researched on launch day, 19 November 2026, from public pages only: Exophase (official list), PowerPyx (trophy guide and 100% guide), GTABase, GTADB, CryptoGames, KeenGamer and Of Zen and Computing. Every guide names its sources beside it in the app. No text is copied from them: facts are restated in our own words and linked. Where no source has solved a trophy yet, the guide says so plainly and works only from the official description. Links open only when you click them; the app itself fetches nothing outside `app/`. No Rockstar Games logos, artwork or screenshots are used; the neon-dusk look is original.

## License

MIT — see [LICENSE](LICENSE).
