# Schema / file locations

## Documentation

| Path | Purpose |
|------|---------|
| [docs/style-blueprint.md](../docs/style-blueprint.md) | Design system blueprint: stylesheet stack, themes (default / dark / zambia / NGO), tokens, typography & paragraph patterns, section class recipes, page-specific CSS index |

## Global styles (typical page)

1. `styles.css` — base tokens + components  
2. `theme-zambia-global.css` — Zambia overrides  
3. `ngo-skin.css` — NGO skin (`data-theme="ngo"`)

## Theme switch

- `html[data-theme]`: default, `dark`, `zambia`, `ngo`
- `theme.js`, `theme-init.js`

## Footer

- Markup: `partials/site-footer.html`  
- Injection: `footer.js` → `#site-footer-placeholder`

## Team page (`team.html`)

- `team-sort.js`: reads `#team-grid` direct `.team-member-card` children; assigns `data-listing-index` from initial DOM order on load; `<select id="team-sort-select">` reorders nodes (`appendChild`).
- Toolbar markup: `.team-sort-toolbar`, `.team-sort-shell` / `.team-sort-shell__inner` (unified pill), `.team-sort-toolbar__icon`, `.team-sort-field` wraps `<select>`.
