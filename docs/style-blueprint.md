# Style blueprint — Free Science Network

Authoritative reference for replicating pages: stylesheet order, themes, tokens, typography (including paragraph patterns), layout, and component class recipes. **Primary visual target:** `html[data-theme="ngo"]` as used on [index.html](../index.html).

---

## 1. Quick start

### Head (order matters)

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="theme-zambia-global.css">
<link rel="stylesheet" href="ngo-skin.css">
```

Optional: [theme-init.js](../theme-init.js) in `<head>` early (theme flash prevention).

### Root element

- `lang="en"` (or page language).
- `data-theme` one of: omit / default light, `dark`, `zambia`, `ngo`.

Example (home):

```html
<html lang="en" data-theme="ngo">
```

### Minimum body structure

```html
<body>
  <header class="site-header" role="banner">…</header>
  <main>…</main>
  <div id="site-footer-placeholder"></div>
  <script src="footer.js"></script>
  <script src="theme.js"></script>
</body>
```

Footer markup is injected from [partials/site-footer.html](../partials/site-footer.html) into `#site-footer-placeholder` by [footer.js](../footer.js).

---

## 2. Theme matrix

| Theme | `data-theme` | Main sources | Character |
|--------|----------------|--------------|-----------|
| Default | (none) | [styles.css](../styles.css) | Sky blue + green gradients, glass header, rounded cards |
| Dark | `dark` | [styles.css](../styles.css) `[data-theme="dark"]` | Dark surfaces, adjusted manifesto / carousel |
| Zambia | `zambia` | [theme-zambia-global.css](../theme-zambia-global.css) | Sunrise/cream/warm browns; remaps `--color-*` |
| NGO | `ngo` | [ngo-skin.css](../ngo-skin.css) | Warm off-white page, forest manifesto/footer, editorial type, flat cards (`4px` radius), terrain waves |

NGO rules are scoped under `[data-theme="ngo"]` (plus the NGO toggle button, which is always in the nav). Zambia and default share most structure; NGO overrides colors and several components heavily.

**Scripts:** [theme.js](../theme.js) persists theme and toggles; NGO scroll adds `.ngo-scrolled` on `.site-header` for the frosted bar.

---

## 3. Color and design tokens

### 3.1 Base palette (`:root` in styles.css)

| Token | Typical use |
|--------|-------------|
| `--color-primary` | Sky blue UI, links, gradients |
| `--color-primary-light` … `--color-primary-darker` | Hover / depth |
| `--color-secondary` | Nature green |
| `--color-secondary-light` … `--color-secondary-darker` | Green scale |
| `--color-accent` | Teal accents |
| `--color-highlight` | Gold highlights |
| `--color-neutral-50` … `--color-neutral-900` | Gray scale |
| `--color-text` | Body text |
| `--color-text-muted` | Secondary text |
| `--color-text-light` | Tertiary |
| `--color-text-inverse` | On dark buttons |
| `--color-surface`, `--color-surface-elevated`, `--color-surface-glass` | Cards / glass |
| `--color-border`, `--color-border-light`, `--color-border-focus` | Strokes / focus |
| `--gradient-sky`, `--gradient-grass`, `--gradient-nature`, `--gradient-primary`, … | Backgrounds |
| `--shadow-sm` … `--shadow-xl`, `--shadow-glow-*` | Elevation |
| `--radius-sm` (8px) … `--radius-full` | Corners |
| `--spacing-xs` … `--spacing-2xl` | Rhythm |
| `--transition-fast` / `--transition-base` / `--transition-slow` | Motion |
| `--manifesto-expand-fade` | Collapsed manifesto fade mask (theme-specific overrides) |

**Hex reference (primary semantic):**

- Primary blue: `#3498db`
- Secondary green: `#27ae60`
- Text: `#263238`
- Text muted: `#607d8b`
- Page wash: `--color-neutral-50` `#f8fbfc` + radial blues/greens on `body`

### 3.2 Zambia remaps ([theme-zambia-global.css](../theme-zambia-global.css))

Under `[data-theme="zambia"]`, `--color-text`, `--color-primary`, `--color-secondary`, surfaces, borders, and shadows are remapped to warm ink/sunrise/leaf tones (e.g. `--zm-ink` `#3d2918`, `--zm-sunset` `#e85a0c`, `--zm-leaf` `#3e6f2a`). Projects page extras: `--p-bg`, `--p-text`, `--p-muted`, etc.

### 3.3 NGO tokens ([ngo-skin.css](../ngo-skin.css) `:root`)

| Token | Value | Role |
|--------|--------|------|
| `--ngo-bg` | `#f7f5f0` | Page / light panel background |
| `--ngo-dark` | `#2e3c1e` | Manifesto section, footer |
| `--ngo-text` | `#26291e` | Body text on light |
| `--ngo-muted` | `#5c5e4e` | Secondary text on light |
| `--ngo-on-dark` | `#e4e0d4` | Body text on dark green |
| `--ngo-accent` | `#7a8c52` | **Decorative only** (borders, strokes) — not for text |
| `--ngo-accent-text` | `#4a5c28` | Text-safe accent on **light** backgrounds |
| `--ngo-accent-dark` | `#a8ba6a` | Text-safe accent on **dark** (`--ngo-dark`) |
| `--ngo-accent-btn` | `#46581f` | Filled buttons / badges (white text) |
| `--ngo-accent-h` | alias of `--ngo-accent-text` | Profit label + manifesto expand toggle gradient start |
| `--ngo-footer-link` | `#c8c0b4` | Footer links on dark |
| `--ngo-footer-meta` | `#bab2a8` | Footer meta line |
| `--ngo-border` | `rgba(38, 41, 30, 0.13)` | Card borders |
| `--ngo-wave` | `52px` (36px ≤768px) | Terrain clip wave height |
| `--ngo-ease` | `0.35s ease` | Transitions |

---

## 4. Typography

### 4.1 Base `body`

| | Default | NGO |
|---|---------|-----|
| Font | System stack: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, … | Same |
| Size | `16px` (`html` font-size) | Same |
| Line height | `1.6` | `1.8` |
| Color | `var(--color-text)` | `var(--ngo-text)` |
| Background | Neutral + soft blue/green radials | `var(--ngo-bg)` |

**Noto Sans** is imported in [styles.css](../styles.css) for multi-script support; body still defaults to system UI stack unless extended elsewhere.

### 4.2 Headings and hero (key classes)

| Class / element | Default (styles.css) | NGO override (ngo-skin.css) |
|-----------------|----------------------|-----------------------------|
| `.hero-site-title` (home) | Gradient text, `clamp(1.75rem, 4.2vw, 2.85rem)`, weight 700 | Solid `--ngo-text`, wider letter-spacing `0.06em`, `clamp(1.85rem, 4.5vw, 3rem)` |
| `.hero-title` (inner pages) | Large gradient clip, weight 800 | Solid `--ngo-text`, `clamp(2rem, 5vw, 3.5rem)`, letter-spacing `0.06em` |
| `.hero-subtitle` | Muted, clamp ~1–1.5rem | `--ngo-muted`, adjusted clamp |
| `.hero-description` | Muted, max-width 720px, lh 1.75 | `--ngo-muted`, max-width 640px, lh 1.8 |
| `.section-title` / `.page-title` | Theme gradients / rules | Solid `--ngo-text`, no gradient clip |
| `.initial-choice-group-title` | `2rem`, 700, centered | `clamp(1.5rem, 3vw, 2.2rem)`, letter-spacing `0.06em` |
| `.manifesto-title` | `clamp(2rem, 5vw, 3.25rem)`, 900 | White on dark manifesto |
| `.manifesto-stance__title` | Large 900, `--color-text` | White on dark |
| `.manifesto-right__name` | `1.1rem`, 700 | White (on dark section) in NGO |
| `.manifesto-profit__label` | Uppercase, `--color-primary` | `--ngo-accent-h` (text-safe green) |
| `.footer-heading` | (base footer styles) | `0.7rem`, uppercase, `0.12em` tracking, white |

### 4.3 Paragraph cookbook (no global `p {}`)

Bare `<p>` inherits `body`. Prefer these patterns:

| Selector / pattern | Font size | Line height | Color (default) | Color (NGO) | Max width / notes |
|--------------------|-----------|-------------|-----------------|-------------|-------------------|
| `.manifesto-lead` | `clamp(1rem, 1.6vw, 1.15rem)` | 1.75 | `--color-text-muted` | `--ngo-on-dark` | 640px, centered |
| `.manifesto-right__text` | `0.92rem` | 1.65 | `--color-text-muted` | `--ngo-on-dark` | — |
| `.manifesto-closing p` | `clamp(1.05rem, 1.8vw, 1.3rem)` | 1.65 | italic 500 `--color-text` | `--ngo-on-dark` | Quote block |
| `.manifesto-stance__body p` | `clamp(0.95rem, 1.4vw, 1.05rem)` | 1.75 | `--color-text-muted` | `--ngo-muted` (on light panel) | strong → `--ngo-text` |
| `.manifesto-profit__text p` | same clamp as stance | 1.75 | `--color-text-muted` | `--ngo-muted` | — |
| `.initial-choice-subtitle` | `1.15rem` | — | `--color-text-muted` | use with `.initial-choice-about__lead` | centered |
| `.initial-choice-about__lead` | inherits + margin | 1.8 (NGO) | `--color-text-muted` | `--ngo-muted` | 640px auto |
| `.choice-description` | `1rem` | 1.6 (1.8 NGO) | `--color-text-muted` | `--ngo-muted` | — |
| `.current-project-caption` | `0.9rem` | 1.45 | `--color-text-muted` | inherits / card context | — |
| `.partners-intro` | — | 1.8 | — | `--ngo-muted` | 640px |
| `.translation-modal-message` | (modal) | — | — | — | Modal copy |

---

## 5. Spacing, radius, shadows

| Element | Default | NGO |
|---------|---------|-----|
| `.container` | max-width **1200px**, padding **0 1.5rem** | Same (except hero full-bleed wrapper) |
| `.manifesto` | `5rem 0 6rem` | `80px` top/bottom + wave overlap; mobile `60px` |
| `.initial-choice` | `0 0 4rem` | Top padding `calc(80px + var(--ngo-wave))` |
| `.service-card` / `.choice-card` | border **2px**, radius **`var(--radius-lg)` (16px)**, shadows | **1px** border, **`4px` radius**, no shadow; hover `scale(1.03)` |
| `.manifesto-right` | radius 14px, shadow sm | Transparent / subtle border on dark |
| `.cta-button` | gradient, radius md | Solid `--ngo-accent-btn`, `6px` radius |

---

## 6. Section blueprints (class recipes)

### 6.1 Header

- `header.site-header` — sticky, glass (default) or transparent → `.ngo-scrolled` (NGO).
- Inner: `nav.nav-container`
- Brand: `div.nav-brand` → `a.brand-link` → `img.site-logo`
- Links: `ul.nav-links` → `li` → `a.nav-link` (`.active` + `aria-current="page"` for current)
- Controls: `div.nav-controls` — theme buttons, `div.language-selector`, `div.social-icons`

### 6.2 Home hero + carousel

- `section.hero` → `div.container` (NGO: container may be full width for carousel)
- `h1.hero-site-title`
- `div.hero-banner.hero-banner--carousel` → `div.hero-carousel` with `hero-carousel-viewport`, slides (`hero-carousel-slide.is-active`), `hero-carousel-toolbar` (arrows + dots)

See [index.html](../index.html) for full ARIA pattern.

### 6.3 Manifesto

- `section.manifesto#manifesto` → `div.container`
- Header: `div.manifesto-header` — `p.manifesto-eyebrow`, `h2.manifesto-title`, `p.manifesto-lead`
- Expandable: `div.manifesto-expandable#manifesto-expandable` — `div.manifesto-expandable__clip` → `div#manifesto-collapsible.manifesto-expandable__inner` — list `ol.manifesto-rights` / `li.manifesto-right` (optional `manifesto-right--accent`), blockquote `manifesto-closing`, `div.manifesto-stance`, `div.manifesto-profit`
- `div.manifesto-expandable__fade`, `button.manifesto-expandable__toggle` (`.is-expanded` on parent)

NGO: top/bottom `::before` / `::after` terrain waves on `.manifesto`.

### 6.4 Initial choice (about + cards)

- `section.initial-choice#initial-choice` → `div.container`
- About: `div.initial-choice-about` — `h2.initial-choice-group-title`, `p.initial-choice-subtitle.initial-choice-about__lead`, optional `div.initial-choice-about__howitworks-block`
- Project grid: `h2.initial-choice-group-title#what-we-do`, `div.service-cards.current-project-cards` → `article.service-card.service-card-*.current-project-card` with `span.current-project-tag`, `h3.service-title`, `p.current-project-caption`
- CTA grid: `h2` + `div.choice-cards` → `button.choice-card` with `div.choice-icon`, `h3.choice-title`, `p.choice-description`

### 6.5 Footer (in partial)

- `footer.site-footer` → `div.container` → `div.footer-content` → columns `div.footer-section` with `h3.footer-heading`, `p.footer-contact-text` / `ul.footer-links`
- `div.footer-bottom` — copyright, ENS, wallet `code`

---

## 7. Motion and a11y

- **NGO scroll fade:** `.ngo-fade` → `.ngo-fade.ngo-visible` (opacity + translateY); disabled under `prefers-reduced-motion: reduce`.
- **Manifesto expand:** `max-height` transition on `.manifesto-expandable__clip`; fade on `.manifesto-expandable__fade`.
- **Focus:** e.g. `.manifesto-expandable__toggle:focus-visible`, theme buttons `:focus-visible`.

---

## 8. Page-specific stylesheets

| File | Used by (typical) |
|------|-------------------|
| [volunteering-signup.css](../volunteering-signup.css) | Volunteering signup flows |
| [events/courses.css](../events/courses.css) | Courses |
| [project-zambia.css](../project-zambia.css) | Project Zambia page |
| [projects.css](../projects.css) | Projects listing |
| [tools-services.css](../tools-services.css) | Tools / services page |

Add the global trio first, then the page CSS.

---

## 9. Modals (shared classes)

Present on [index.html](../index.html): `.translation-modal-overlay` / `.translation-modal`; `.disclaimer-overlay` / `.disclaimer-modal`. Styling lives in [styles.css](../styles.css) (search class names). Reuse the same classes for consistent chrome.

---

## 10. Maintenance

- When changing `:root` tokens, NGO tokens, or section layout, **update this file in the same change**.
- Keep **manifesto copy** in sync between `index.html` and `manifesto.html` (comment in HTML).
- **`--ngo-accent-h`** is defined in [ngo-skin.css](../ngo-skin.css) as an alias of `--ngo-accent-text` for profit labels and expand-toggle gradients (previously referenced but undefined).

---

## 11. File index

| File | Role |
|------|------|
| [styles.css](../styles.css) | Base design system + most components |
| [theme-zambia-global.css](../theme-zambia-global.css) | Zambia theme variable overrides |
| [ngo-skin.css](../ngo-skin.css) | NGO narrative skin |
| [theme.js](../theme.js) | Theme persistence + NGO header scroll |
| [theme-init.js](../theme-init.js) | Early theme application |
| [footer.js](../footer.js) | Footer injection |
| [partials/site-footer.html](../partials/site-footer.html) | Footer markup template |
