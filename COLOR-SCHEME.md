# Free Science - Color Scheme Documentation

## Overview

This document defines the official color scheme for the Free Science website. The palette is inspired by the **navbar background image** (`images/navbar-bg.png`), which features a natural landscape with:

- **Sky blue tones** (representing openness and clarity)
- **Green rolling hills** (representing growth and nature)
- **Teal/cyan molecular structures** (representing science and innovation)
- **Warm sunlight highlights** (representing hope and energy)
- **City silhouette** (representing community and progress)

---

## Color Palette

### Primary Colors (Sky Blue)
Use for main interactive elements, primary buttons, and key highlights.

| CSS Variable | Hex Code | RGB | Usage |
|-------------|----------|-----|-------|
| `--color-primary` | `#3498db` | rgb(52, 152, 219) | Main buttons, links, primary accents |
| `--color-primary-light` | `#5dade2` | rgb(93, 173, 226) | Hover states, lighter accents |
| `--color-primary-lighter` | `#85c1e9` | rgb(133, 193, 233) | Subtle backgrounds, borders |
| `--color-primary-dark` | `#2980b9` | rgb(41, 128, 185) | Active states, emphasis |
| `--color-primary-darker` | `#1a5276` | rgb(26, 82, 118) | Strong contrast elements |

### Secondary Colors (Nature Greens)
Use for success states, eco/sustainability themes, and secondary actions.

| CSS Variable | Hex Code | RGB | Usage |
|-------------|----------|-----|-------|
| `--color-secondary` | `#27ae60` | rgb(39, 174, 96) | Success messages, positive actions |
| `--color-secondary-light` | `#58d68d` | rgb(88, 214, 141) | Light green accents |
| `--color-secondary-lighter` | `#abebc6` | rgb(171, 235, 198) | Subtle green tints |
| `--color-secondary-dark` | `#1e8449` | rgb(30, 132, 73) | Strong green emphasis |
| `--color-secondary-darker` | `#145a32` | rgb(20, 90, 50) | Dark green contrast |

### Accent Colors (Teal/Cyan)
Use for scientific elements, molecular/data visualizations, and tertiary highlights.

| CSS Variable | Hex Code | RGB | Usage |
|-------------|----------|-----|-------|
| `--color-accent` | `#17a2b8` | rgb(23, 162, 184) | Scientific elements, info badges |
| `--color-accent-light` | `#48d1cc` | rgb(72, 209, 204) | Light teal highlights |
| `--color-accent-lighter` | `#76d7c4` | rgb(118, 215, 196) | Aquamarine tints |
| `--color-accent-dark` | `#138d75` | rgb(19, 141, 117) | Dark teal for emphasis |

### Highlight Colors (Sunlight/Gold)
Use sparingly for special emphasis, warnings, or featured content.

| CSS Variable | Hex Code | RGB | Usage |
|-------------|----------|-----|-------|
| `--color-highlight` | `#f1c40f` | rgb(241, 196, 15) | Featured items, gold accents |
| `--color-highlight-light` | `#f9e79f` | rgb(249, 231, 159) | Subtle gold backgrounds |
| `--color-highlight-green` | `#c5e1a5` | rgb(197, 225, 165) | Yellow-green glow effects |

### Semantic Colors
Standard semantic colors for status indication.

| CSS Variable | Hex Code | Usage |
|-------------|----------|-------|
| `--color-success` | `#27ae60` | Success messages, confirmations |
| `--color-warning` | `#f39c12` | Warnings, cautions |
| `--color-error` | `#e74c3c` | Errors, destructive actions |
| `--color-info` | `#3498db` | Informational messages |

### Neutral Colors (Slate/Gray)
Use for text, backgrounds, borders, and structural elements.

| CSS Variable | Hex Code | Usage |
|-------------|----------|-------|
| `--color-neutral-50` | `#f8fbfc` | Lightest backgrounds |
| `--color-neutral-100` | `#ecf5f8` | Very light backgrounds |
| `--color-neutral-200` | `#d4e6ed` | Light borders |
| `--color-neutral-300` | `#b0c4ce` | Medium light borders |
| `--color-neutral-400` | `#90a4ae` | Muted text, icons |
| `--color-neutral-500` | `#78909c` | Secondary text |
| `--color-neutral-600` | `#607d8b` | Body text (muted) |
| `--color-neutral-700` | `#455a64` | Dark elements |
| `--color-neutral-800` | `#37474f` | Very dark elements |
| `--color-neutral-900` | `#263238` | Primary text, headings |

---

## Text Colors

### Light Mode
| CSS Variable | Hex Code | Usage |
|-------------|----------|-------|
| `--color-text` | `#263238` | Primary text, headings |
| `--color-text-muted` | `#607d8b` | Secondary text, descriptions |
| `--color-text-light` | `#90a4ae` | Tertiary text, hints |
| `--color-text-inverse` | `#ffffff` | Text on dark backgrounds |

### Dark Mode
| CSS Variable | Value | Usage |
|-------------|-------|-------|
| `--color-text` | `rgba(255, 255, 255, 0.92)` | Primary text |
| `--color-text-muted` | `rgba(176, 196, 206, 0.8)` | Secondary text |
| `--color-text-light` | `rgba(176, 196, 206, 0.6)` | Tertiary text |

---

## Gradients

### Predefined Gradient Variables

```css
/* Sky gradient - vertical blue transition */
--gradient-sky: linear-gradient(180deg, #85c1e9 0%, #aed6f1 50%, #d4e6ed 100%);

/* Grass gradient - vertical green transition */
--gradient-grass: linear-gradient(180deg, #abebc6 0%, #82e0aa 50%, #58d68d 100%);

/* Sunrise gradient - diagonal warm tones */
--gradient-sunrise: linear-gradient(135deg, #f9e79f 0%, #f1c40f 50%, #f39c12 100%);

/* Nature gradient - full landscape (sky to grass) */
--gradient-nature: linear-gradient(180deg, #85c1e9 0%, #aed6f1 30%, #d4e6ed 50%, #c5e1a5 70%, #abebc6 100%);

/* Primary gradient - for buttons */
--gradient-primary: linear-gradient(135deg, #3498db 0%, #17a2b8 100%);

/* Secondary gradient - for secondary buttons */
--gradient-secondary: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);

/* Accent gradient - for accent elements */
--gradient-accent: linear-gradient(135deg, #17a2b8 0%, #48d1cc 100%);
```

### Title Gradients

**Light Mode:**
```css
background: linear-gradient(135deg, #263238 0%, #3498db 50%, #27ae60 100%);
```

**Dark Mode:**
```css
background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, #85c1e9 50%, #76d7c4 100%);
```

---

## Shadows

### Shadow Variables

```css
/* Small shadow - subtle elevation */
--shadow-sm: 0 4px 12px rgba(38, 50, 56, 0.08);

/* Medium shadow - cards, containers */
--shadow-md: 0 8px 24px rgba(38, 50, 56, 0.12);

/* Large shadow - modals, dropdowns */
--shadow-lg: 0 16px 40px rgba(38, 50, 56, 0.14);

/* Extra large shadow - prominent elements */
--shadow-xl: 0 24px 50px rgba(38, 50, 56, 0.18);

/* Glow shadows - for interactive elements */
--shadow-glow-primary: 0 4px 20px rgba(52, 152, 219, 0.25);
--shadow-glow-secondary: 0 4px 20px rgba(39, 174, 96, 0.25);
--shadow-glow-accent: 0 4px 20px rgba(23, 162, 184, 0.25);
```

---

## Dark Mode

### Background Colors

**Light Mode Background:**
```css
background: 
  radial-gradient(1200px 700px at 15% -10%, rgba(52, 152, 219, 0.12), transparent 60%),
  radial-gradient(900px 650px at 85% 10%, rgba(39, 174, 96, 0.10), transparent 55%),
  radial-gradient(600px 400px at 50% 100%, rgba(197, 225, 165, 0.15), transparent 50%),
  #f8fbfc;
```

**Dark Mode Background:**
```css
background: 
  radial-gradient(1200px 700px at 15% -10%, rgba(93, 173, 226, 0.18), transparent 60%),
  radial-gradient(900px 650px at 85% 10%, rgba(88, 214, 141, 0.14), transparent 55%),
  radial-gradient(600px 400px at 50% 100%, rgba(118, 215, 196, 0.10), transparent 50%),
  #1a252f;
```

### Surface Colors

| Mode | Surface | Elevated | Glass |
|------|---------|----------|-------|
| Light | `#ffffff` | `rgba(255, 255, 255, 0.92)` | `rgba(255, 255, 255, 0.85)` |
| Dark | `#1a252f` | `rgba(38, 50, 56, 0.72)` | `rgba(38, 50, 56, 0.85)` |

---

## Usage Guidelines for LLMs

### When Creating New Elements

1. **Always use CSS variables** instead of hardcoded colors:
   ```css
   /* ✅ Good */
   color: var(--color-text);
   background: var(--color-primary);
   
   /* ❌ Bad */
   color: #263238;
   background: #3498db;
   ```

2. **Use semantic color names** for their intended purpose:
   - `--color-primary` for main actions
   - `--color-secondary` for secondary/success actions
   - `--color-accent` for scientific/info elements
   - `--color-error` for errors only

3. **Always consider both light and dark modes**:
   ```css
   .my-element {
     background: var(--color-surface);
     color: var(--color-text);
   }
   
   [data-theme="dark"] .my-element {
     /* Dark mode overrides if needed */
   }
   ```

### Button Styling

**Primary Button:**
```css
.button-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-glow-primary);
}
```

**Secondary Button:**
```css
.button-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

### Card Styling

```css
.card {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}
```

### Input Styling

```css
.input {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}
```

### Link Styling

```css
.link {
  color: var(--color-primary);
}

.link:hover {
  color: var(--color-primary-dark);
}
```

---

## Border Radius

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius-sm` | `8px` | Small elements, tags |
| `--radius-md` | `12px` | Inputs, buttons |
| `--radius-lg` | `16px` | Cards, containers |
| `--radius-xl` | `24px` | Large cards, modals |
| `--radius-full` | `9999px` | Pills, circular elements |

---

## Spacing

| Variable | Value | Usage |
|----------|-------|-------|
| `--spacing-xs` | `0.5rem` | 8px - Tight spacing |
| `--spacing-sm` | `1rem` | 16px - Standard small |
| `--spacing-md` | `1.5rem` | 24px - Standard medium |
| `--spacing-lg` | `2rem` | 32px - Standard large |
| `--spacing-xl` | `3rem` | 48px - Section spacing |
| `--spacing-2xl` | `4rem` | 64px - Large section spacing |

---

## Transitions

| Variable | Value | Usage |
|----------|-------|-------|
| `--transition-fast` | `150ms ease` | Quick interactions |
| `--transition-base` | `250ms ease` | Standard transitions |
| `--transition-slow` | `400ms ease` | Elaborate animations |

---

## Best Practices

### Do's ✅

1. Use CSS variables for all colors
2. Test all new elements in both light and dark modes
3. Use appropriate semantic colors (success = green, error = red, etc.)
4. Maintain consistent border-radius using variables
5. Use gradient backgrounds for primary buttons and hero sections
6. Apply appropriate shadows for elevation hierarchy
7. Use the neutral scale for text and structural elements

### Don'ts ❌

1. Don't hardcode hex colors in CSS
2. Don't use colors outside this palette without approval
3. Don't forget dark mode styles
4. Don't mix old color schemes (like purple gradients) with this nature palette
5. Don't use pure black (#000000) - use `--color-neutral-900` instead
6. Don't use pure white (#ffffff) for backgrounds in dark mode
7. Don't create gradients that conflict with the nature theme

---

## File References

- **Main stylesheet:** `styles.css`
- **Projects stylesheet:** `projects.css`
- **Theme switcher:** `theme.js`
- **Background image:** `images/navbar-bg.png`
- **Logo:** `images/logo.png`

---

## Color Inspiration

The color scheme draws from the natural landscape in the navbar background:

```
┌─────────────────────────────────────────┐
│  ☁️ Sky Blue (#85c1e9, #5dade2)         │
│     ∿ Molecular structures (#48d1cc)    │
├─────────────────────────────────────────┤
│  🏙️ City Silhouette (#90a4ae)           │
├─────────────────────────────────────────┤
│  🌿 Rolling Hills (#27ae60, #58d68d)    │
│  ✨ Sunlight Glow (#c5e1a5, #f1c40f)    │
│  🌱 Grass (#abebc6)                     │
└─────────────────────────────────────────┘
```

This creates a cohesive visual identity that represents:
- **Science** (molecular structures, sky/space)
- **Nature** (green fields, sustainability)
- **Community** (city skyline, collaboration)
- **Hope** (sunlight, positive future)
