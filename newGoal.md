<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">

  <!-- Smooth blob -->
  <path 
    d="
      M150,40
      C200,30 250,70 260,120
      C280,180 240,240 180,260
      C120,280 60,250 40,190
      C20,130 60,60 120,45
      C135,42 145,40 150,40
      Z
    "
    fill="#F4F4F4"
    stroke="#000000"
    stroke-width="6"
  />

  <!-- Text -->
  <text 
    x="150" 
    y="130" 
    text-anchor="middle"
    font-size="34"
    font-family="Georgia, 'Times New Roman', serif"
    font-weight="bold"
    fill="#000000"
  >
    1x 45 €
  </text>

  <text 
    x="150" 
    y="180" 
    text-anchor="middle"
    font-size="34"
    font-family="Georgia, 'Times New Roman', serif"
    font-weight="bold"
    fill="#000000"
  >
    3x 99€
  </text>

</svg>

In your layout (not SVG):

transform: rotate(-3deg);
filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));

👉 This makes it feel premium + physical

Refine the LEFT SIDE (menu panel) of the Cannastore Vienna TV layout.

Do NOT change layout structure. Only improve spacing and typography hierarchy.

---

## 1. SPACING (IMPORTANT)

Current issue:
- Content feels too dense vertically
- Looks like admin panel instead of retail display

Fix:

- Increase vertical spacing between major sections by ~20–30%
- Add more space ABOVE each section title
- Add slight spacing between rows (items) for readability at distance

Rules:
- Keep it dense but breathable
- Must be readable from 3–5 meters (TV use)

---

## 2. TYPOGRAPHY HIERARCHY

Current issue:
- Section titles and labels feel visually flat

Fix:

### Section titles (e.g. PREMIUM QUALITÄT, SONDERANGEBOTE)
- Increase letter spacing (tracking)
- Slightly brighter green or higher contrast
- Add subtle bottom divider line

### Sub-labels (e.g. HASH, EXTRACTS small labels)
- Reduce opacity (less visual weight)
- Keep them secondary

### Prices
- Keep aligned right
- Slightly brighter than item names
- Consistent format (EUR)

---

## 3. VISUAL STRUCTURE

- Add thin horizontal divider lines between sections
- Use subtle green accent (low opacity)
- Keep everything aligned to grid

---

## 4. IMPORTANT

Do NOT:
- Add cards
- Add shadows
- Add borders around sections

This is a premium retail display, not a dashboard UI.

---

## GOAL

Make the menu feel:
- More premium
- More readable at distance
- Less cramped
- Better hierarchy without changing layout
