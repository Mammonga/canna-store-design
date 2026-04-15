<!-- # Cannastore Vienna — Implementation Schema
> Structured task plan covering design polish, production readiness, and multi-store deployment.
> Each task is self-contained and ordered by priority.

---

## TASK-01 · Fix placeholder copy & slow ad rotation
**Priority:** P0 — blocks going live  
**Effort:** 5 min  
**Files:** `src/App.js`

**Problem:**  
Cherry Rush slide subtitle reads *"Smaller pack composition with foreground pebbles and the real badge."* — a layout note, not customer copy. Ad rotation is 5 000 ms, too fast for in-store viewing distance.

**Approach:**
- Replace Cherry Rush subtitle with real marketing copy.
- Change `setInterval` from `5000` to `9000`.

**Acceptance criteria:**
- No dev notes visible on any slide.
- Each slide displays for 9 seconds before transitioning.

---

## TASK-02 · Swap system fonts for a reliable web font
**Priority:** P0 — visual regression risk on non-Windows hardware  
**Effort:** 15 min  
**Files:** `src/App.css`

**Problem:**  
`Arial Nova` and `Aptos` are Windows 11–only fonts. Any Mac mini, Linux TV stick, or older Windows box silently falls back to `Segoe UI → Arial`, breaking the typographic feel across stores.

**Approach:**
```css
/* Add to top of App.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
```
- Replace every `'Arial Nova', 'Aptos', 'Segoe UI', sans-serif` with `'Inter', sans-serif`.
- Self-host the font files in `/public/fonts/` if displays run without reliable internet access.

**Acceptance criteria:**
- Typography renders identically on Windows, macOS, and Linux.
- No fallback font visible in browser devtools computed styles.

---

## TASK-03 · Reformat prices for TV readability
**Priority:** P1 — readability at 3–5 m viewing distance  
**Effort:** 2 hrs  
**Files:** `src/App.js`, `src/components/MenuSection.js`, `src/App.css`

**Problem:**  
`1G 25 EUR | 2,5G 50 EUR` compressed into one line is hard to parse from across a room. Pipe delimiter disappears at distance.

**Approach:**
- Change `price` field in `menuSections` from a string to an array of strings:
  ```js
  price: ['1G — 25 EUR', '2,5G — 50 EUR']
  ```
- In `MenuSection.js`, render each entry as its own `<span>` stacked vertically.
- In `App.css`, add a small `gap` between price lines and make prices slightly brighter than item names (`color: rgba(252,255,249,1)` vs current `0.92`).

**Acceptance criteria:**
- Multi-tier prices render on separate lines.
- Single-price items (oils) render as before — no empty line.
- Readable when viewed from 3 meters on a 55" display.

---

## TASK-04 · Typography & spacing hierarchy (menu panel)
**Priority:** P1 — premium retail feel  
**Effort:** 3 hrs  
**Files:** `src/App.css`

**Problem:**  
Menu panel feels dense and admin-like. Section titles are visually flat. Items and section headers have insufficient hierarchy for a TV display.

**Approach:**

**Spacing:**
- Increase `gap` in `.menu-grid` by ~25% (currently `1.9rem 2.35rem` → `2.4rem 2.35rem`).
- Increase `margin-bottom` on `.menu-section` subgroups.
- Add `padding-top` above each `.section-title` (~0.6rem extra).
- Increase `.menu-items` gap from `0.88rem` to `1.1rem`.

**Section titles:**
- Increase `letter-spacing` from `0.18em` to `0.26em`.
- Push color closer to `#b8ffb8` (brighter, more contrast against dark bg).
- Keep existing text-shadow glow, increase blur radius slightly.

**Sub-labels (translation spans):**
- Reduce opacity from `0.56` to `0.42` — demote them further from primary hierarchy.

**Prices:**
- Slightly brighter than item names (see TASK-03).
- Consistent `EUR` suffix — no mixed formats.

**Rules (do not add):**
- No cards, no shadows, no borders around sections.
- No rounded corners anywhere.

**Acceptance criteria:**
- Clear 3-level hierarchy visible at a glance: section title > item name > translation/price.
- Sections feel breathable without wasting vertical space.
- Passes the "3-meter test": legible from across a medium-sized room.

---

## TASK-05 · Connect ad panel to menu (product alignment)
**Priority:** P1 — UX coherence  
**Effort:** 4 hrs  
**Files:** `src/App.js`, `src/components/ZoogiesAdLoop.js`, `src/components/CannastoreMenu.js`

**Problem:**  
Zoogies Aroma Pebbles is prominently featured in the right panel but does not appear anywhere in the left-side menu. Customers who want to buy it have no path.

**Approach — Option A (simple):**
- Add a Zoogies section to `menuSections` in `App.js` with item names matching the four flavors, pricing, and a `featured: true` flag.
- Style the featured section with a slightly brighter accent to tie it visually to the ad.

**Approach — Option B (dynamic, preferred):**
- Add a `menuId` field to each slide in `slides` array (e.g. `menuId: 'zoogies-blueberry-pebbles'`).
- Lift `activeIndex` state up to `App.js` via a callback from `ZoogiesAdLoop`.
- Pass active `menuId` down to `CannastoreMenu` and use it to apply a `.is-featured` highlight class to the matching menu item during its slide.

**Acceptance criteria:**
- Every product shown in the ad panel has a corresponding menu entry.
- (Option B) The active product is visually indicated on the menu while its slide is showing.

---

## TASK-06 · Externalize menu data (Google Sheets data layer)
**Priority:** P2 — required for multi-store deployment  
**Effort:** 1–2 days  
**Files:** `src/App.js`, new `src/hooks/useMenuData.js`, new `src/utils/parseMenuCsv.js`

**Problem:**  
`menuSections` and `slides` are hardcoded in `App.js`. Any price change or product update requires a code edit and redeployment. This does not scale to multiple stores.

**Approach:**
1. Create one Google Sheet per store (or one shared sheet with a `storeId` column).
2. Publish the sheet as CSV: *File → Share → Publish to web → Comma-separated values*.
3. Build `parseMenuCsv.js` — a pure function that maps CSV rows to the `menuSections` shape:
   ```
   columns: section | sectionEn | group | groupEn | itemName | itemNameEn | price | featured
   ```
4. Build `useMenuData.js` — a React hook that:
   - Fetches the CSV URL on mount.
   - Re-fetches every 5 minutes (`setInterval`).
   - Returns `{ sections, loading, error }`.
5. In `App.js`, replace the hardcoded `menuSections` with the hook result. Show a minimal loading state on first fetch.

**CSV shape (per row):**
| section | sectionEn | group | groupEn | itemName | itemEn | price | featured |
|---|---|---|---|---|---|---|---|
| Premium Qualität | Premium Quality | | | Hash | Hash | 1G — 25 EUR | false |
| Premium Qualität | Premium Quality | Cannain Öl | Cannain Oil | Synergy Core | Synergy Core | 65 EUR | false |

**Acceptance criteria:**
- Editing a price in the Google Sheet reflects on the display within 5 minutes, no redeploy.
- App handles fetch failure gracefully (shows last known data, not a blank screen).
- Works on all store display hardware with the same codebase.

--- --> done

## TASK-07 · Smoke performance — test & conditional fallback
**Priority:** P2 — deployment risk  
**Effort:** 1 hr test + 2–3 days if fallback needed  
**Files:** `src/components/CannastoreMenu.js`, `src/App.css`

**Problem:**  
The smoke effect uses 10+ SVG layers with `feTurbulence + feDisplacementMap + feGaussianBlur` running simultaneously. On cheap TV box hardware this may render below 30fps, causing visible stutter in the most prominent UI element.

**Approach — Phase 1: Measure**  
Run this in the browser console on the target display hardware:
```js
let last = performance.now(), frames = 0;
const tick = () => {
  frames++;
  const now = performance.now();
  if (now - last > 1000) {
    console.log(Math.round(frames * 1000 / (now - last)) + ' fps');
    frames = 0; last = now;
  }
  requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```
- **≥ 45 fps** → no action needed.
- **30–44 fps** → reduce displacement scale and remove the heavy filter (`smokeTurbHeavy`).
- **< 30 fps** → implement canvas fallback (Phase 2).

**Approach — Phase 2: Conditional degradation**  
Add a `data-perf` attribute to `<body>` based on a first-paint frame-rate sample. In CSS:
```css
[data-perf="low"] .smoke-outer-glow,
[data-perf="low"] .smoke-mid-glow {
  filter: none; /* drop the heavy displacement, keep Gaussian only */
}
```
This keeps the visual without the most expensive filter operations.

**Approach — Phase 3: Canvas fallback (if < 30fps)**  
Replace the SVG smoke with a `<canvas>` particle system:
- ~40 bezier-curve particles, each with an independent lifespan, opacity, and drift vector.
- Render loop capped at 30fps via `setTimeout` inside `requestAnimationFrame`.
- Identical green gradient color scheme — visually indistinguishable from SVG version.

**Acceptance criteria:**
- Display renders smoke at ≥ 45fps on all target hardware.
- If hardware is too slow, fallback activates automatically without manual config.
- Fallback is visually acceptable — no sudden blank header.

---

## TASK-08 · 16:9 aspect ratio lock for TV deployment
**Priority:** P2 — display hardware fit  
**Effort:** 1 hr  
**Files:** `src/App.css`

**Problem:**  
The current layout uses `100vw / 100vh` which works correctly on a TV in full-screen kiosk mode, but could distort on non-standard displays or if the browser chrome is visible.

**Approach:**
- Add a `@media` query targeting non-16:9 ratios:
  ```css
  @media (max-aspect-ratio: 16/9) {
    .screen-layout { height: calc(100vw * 9 / 16); }
  }
  @media (min-aspect-ratio: 16/9) {
    .screen-layout { width: calc(100vh * 16 / 9); margin: 0 auto; }
  }
  ```
- Test in browser with DevTools device emulation set to 1920×1080.

**Acceptance criteria:**
- Layout does not stretch or compress on 16:9 and 16:10 screens.
- Content is not cut off at any standard TV resolution (1080p, 4K).

---

## Summary

| ID | Task | Priority | Effort | Status |
|---|---|---|---|---|
| TASK-01 | Fix placeholder copy + ad timing | P0 | 5 min | open |
| TASK-02 | Web font (Inter) | P0 | 15 min | open |
| TASK-03 | Price format — stacked lines | P1 | 2 hrs | open |
| TASK-04 | Typography & spacing hierarchy | P1 | 3 hrs | open |
| TASK-05 | Connect ad panel to menu | P1 | 4 hrs | open |
| TASK-06 | Google Sheets data layer | P2 | 1–2 days | open |
| TASK-07 | Smoke performance + fallback | P2 | 1 hr + | open |
| TASK-08 | 16:9 aspect ratio lock | P2 | 1 hr | open |
