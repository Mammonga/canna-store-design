Build a fullscreen 16:9 digital menu display for a store called "Cannastore Vienna".

Tech:
- Next.js (App Router)
- React
- Tailwind CSS
- No external UI libraries

---

## Layout (CRITICAL)

Use a golden ratio split:

- Left side: 62% width → MENU
- Right side: 38% width → ADVERTISEMENT

The golden ratio (~1:1.618) creates a visually balanced layout and should be respected precisely in widths. :contentReference[oaicite:0]{index=0}

Full screen:
- width: 100vw
- height: 100vh
- no scrolling
- optimized for TV / display

---

## LEFT SIDE (MENU)

Top-left:
- Place Cannastore Vienna logo (provided asset)

Below:
- Clean, dense menu layout (2 columns grid)

Sections:
- Flowers
- Edibles
- Vapes
- Extras

Each section:
- Title (slightly green accent)
- List of items with:
  - name (left)
  - price (right)

Style:
- Dark background (black / zinc-900)
- High readability
- Minimal, modern
- No unnecessary UI clutter
- Should feel like a premium store display

---

## RIGHT SIDE (ZOOGIES AD PANEL)

This is a FULL HEIGHT animated advertisement panel.

It should:
- Fill entire right side
- Show images in a loop (fade transition)

---

## AD CONTENT (USE PROVIDED ASSETS)

Cycle through these images:

Products:
- blueberry pack
- strawberry pack
- apple pack
- cherry pack

Pebbles:
- purple pebble
- green pebble
- red pebble

Lifestyle:
- shelf image
- kitchen/baking image

---

## ANIMATION

- Auto-loop forever
- Change every 3 seconds
- Smooth fade transition (opacity)
- No controls, no UI
- Always running

---

## COMPONENT STRUCTURE

Create:

- `CannastoreMenu.tsx`
- `MenuSection.tsx`
- `ZoogiesAdLoop.tsx`

---

## AD LOGIC

Use React state:

- index state
- setInterval loop
- modulo array length

Transition:
- opacity fade (Tailwind)
- duration ~700ms

---

## DESIGN DETAILS (IMPORTANT)

- Ad side = immersive (edge-to-edge images)
- Menu side = structured + readable
- Maintain strong visual contrast between both sides
- No rounded cards, no SaaS look — this is a DISPLAY SCREEN

---

## EXTRA (IF EASY)

- Add slight gradient overlay on ad images for readability
- Add subtle animation smoothing (ease-in-out)

---

## OUTPUT

Return full working code:
- All components
- Tailwind classes included
- No explanations
- Clean and production-ready