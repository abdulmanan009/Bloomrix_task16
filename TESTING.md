# Verification — 6 November 2026

- `npm run build`: passed; Sass compiled successfully with source map and Vite produced `dist/`.
- Browser suite: 4 tests passed using installed Google Chrome via Playwright.
- Phone 390×844, tablet 768×1024, desktop 1440×1000: no document-level horizontal overflow; mobile sidebar toggles correctly. Wide table has its own horizontal scroll area.
- Verified search, status filtering, budget sort, empty-state reset, invalid form feedback, valid project creation, reload persistence, theme switching, refresh loading/disabled state, and Escape dismissal.
- Screenshots: `phone.png`, `tablet.png`, `desktop.png`, `dark-theme.png`, `modal.png` in `screenshots/`.
- Browser test environment used PowerShell environment variables `TEST_BASE_URL=http://127.0.0.1:5177` and `TEST_BROWSER_CHANNEL=chrome` with an existing Vite preview. Normal `npm test` starts its own server and uses Playwright Chromium. To use installed Chrome, set `$env:TEST_BROWSER_CHANNEL='chrome'` before running.
- DevTools exercises in README are provided for study; automated browser tests do not substitute for a screen-reader audit.
