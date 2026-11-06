# Task 16 — Advanced CSS and Sass/SCSS

A local, browser-based project dashboard built specifically for `task16-css.txt`. No framework or backend is needed. Records and theme preferences are saved in this browser using localStorage. Initial data is illustrative; summary cards are computed from the project records.

## Run and compile

Requires Node.js 22.12+ (or a current compatible version).

```sh
npm install
npm run dev
```

Open the URL printed by Vite. `npm run css` compiles `scss/main.scss` into `css/main.css` with `css/main.css.map`. `npm run css:watch` watches SCSS while editing; run this alongside Vite for live style updates. `npm run build` recompiles SCSS and creates `dist/`. The committed compiled CSS is also readable without Sass tooling. Use the development server for the module script.

## SCSS structure and purpose

- `abstracts/_tokens.scss`: compile-time status map, `rem()` function, shared Flexbox/focus/breakpoint mixins. `_index.scss` forwards these through a single module.
- `base/_base.scss`: reset, inherited typography, runtime design tokens, light/dark themes, accessibility utilities, reduced motion.
- `layout/_shell.scss`: mobile-first shell, sticky navigation, collapsed sidebar, summary grid, nested content grids.
- `components/_ui.scss`: reusable BEM components for buttons, cards, badges, filters, table, modal, states. A map loop generates consistent status variants.
- `pages/_dashboard.scss`: dashboard-specific activity and workspace note; the activity container query adapts to its allocated space.
- `main.scss`: loads partials via Sass modules into ordered cascade layers.

Sass variables/functions resolve during compilation; CSS custom properties remain in the browser and can change at runtime. Theme switching updates a root data attribute without recompilation. Nesting is shallow and component classes keep selector specificity low.

## Concept examples and DevTools practice

1. Architecture: `.button` supplies shared structure; `.button--primary` modifies emphasis. `.muted` is a small utility. Components avoid IDs for styling.
2. Cascade: layers are ordered `reset, layout, components, pages`; later layers win normal declarations before specificity is compared. Inspect `.button` in DevTools Styles and toggle hover. A class has specificity `(0,1,0)`, `.button:hover` has `(0,2,0)`, and `:where(...)` contributes zero. Inherited body font reduces repetition; source order decides otherwise equal declarations. `!important` is limited to hidden semantics and reduced-motion overrides; normal component styling avoids it because it makes later overrides harder.
3. Tokens: inspect `--accent`, spacing, font, radius and shadow on `:root`; click the theme control to observe the runtime change.
4. Grid: shell columns use `minmax(0,1fr)` so content can shrink; stats use a two-column mobile grid and four desktop columns. Nested grids organize the page and form. Explicit columns suit these known four cards. For independent variable-size card collections, try `repeat(auto-fit,minmax(min(100%,14rem),1fr))`; auto-fit collapses empty tracks while auto-fill retains them. Named template areas could label this shell, but explicit two-column placement is simpler for its two regions.
5. Flexbox: wrapping filters and heading tolerate narrow widths. `.workspace` and inputs use `min-width:0`. The table scrolls inside its own labelled keyboard-focusable container instead of widening the page.
6. Responsive: media queries progressively add desktop navigation; `clamp()` scales headings/padding. `min()` constrains the dialog and mobile menu; `max()` keeps the toast inset. `100dvh` follows the mobile viewport. Resize the activity panel below 300px to observe its container query.
7. Positioning: sticky topbar (layer 20), mobile sidebar (30), fixed toast (50), and absolute decorative pseudo-element use deliberate containing blocks. Native dialog enters the browser top layer above ordinary z-index stacking contexts.
8. Selectors: `:is()` groups validated inputs, `:where()` keeps focus specificity low, `:not(:disabled)` guards hover, and `:has(:checked)` progressively enhances the confirmation label. Pseudo-elements decorate badges. Native selects provide accessible dropdowns. Focus-visible, checked, disabled and invalid states are implemented.
9. Motion: button transforms/transitions and skeleton keyframes provide feedback. Reduced motion disables nonessential motion without hiding state information. Refresh demonstrates loading and disabled states.
10. UI: searchable/sortable/filterable table, badges, real form validation, native modal with Escape handling and focus restoration, empty state, loading skeleton, focus rings, native title tooltip on the theme control.

## Testing and screenshots

```sh
npx playwright install chromium
npm test
```

Tests cover 390×844 phone, 768×1024 tablet, 1440×1000 desktop, document overflow, navigation, filtering, sorting, empty state, validation, project creation/persistence, theme, modal Escape and loading/disabled feedback. Screenshots are written to `screenshots/` by the tests. See `TESTING.md` for the actual run outcome.

Manual DevTools exercise: inspect the source map back to the SCSS partial; force hover and focus-visible; emulate reduced motion; change container width; inspect computed tokens and cascade layers. No server/API calls or external fonts are used by the dashboard.
