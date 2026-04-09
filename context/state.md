# Project state

## Active

- Local static server: `python3 -m http.server 8080` from repo root → http://127.0.0.1:8080/ (PID may vary per session).

## Last completed (2026-04-09)

- **Team:** Novartis RNAi/molecular biology profile on [team.html](../team.html); photo `images/novartis-basel-scientist.png`. **No personal name in user paste** — card heading is role-based until name provided.
- **Team:** Added Diana (Zhiyuan) Hedlund to [team.html](../team.html); photo `images/diana-hedlund.png` (copied from Cursor assets).

## Last completed (2026-04-06)

- Added [docs/style-blueprint.md](../docs/style-blueprint.md): CSS/theme/token/typography blueprint for replicating pages; NGO as primary target.
- Fixed `--ngo-accent-h` in [ngo-skin.css](../ngo-skin.css) (alias to `--ngo-accent-text`).
- **Hero/footer animal rows:** [styles.css](../styles.css) `.hero-animals` / `.footer-animals` — nowrap + `min-width:0` on imgs; light/dark footer imgs darkened/lightened so cream PNGs read on footer bg. **Footer visibility:** NGO strip `opacity:1` + img ~0.88; removed `opacity(0.07)` from Zambia footer imgs ([theme-zambia-global.css](../theme-zambia-global.css)); Zambia project page footer no longer 0.13 opacity + near-black filter ([project-zambia.css](../project-zambia.css)).

## Next steps

- When changing global or NGO styles, update `docs/style-blueprint.md` in the same PR.

## Blockers

- None.
