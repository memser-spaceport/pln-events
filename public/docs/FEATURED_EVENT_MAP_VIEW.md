# Featured Event Design Implementation — Map View

This document describes how featured events are implemented in the map view of the PLN Events app.

---

## Repository & Branch

| Item | Value |
|------|--------|
| **Repository** | [pln-events](https://github.com/memser-spaceport/pln-events) |
| **Remote** | `https://github.com/memser-spaceport/pln-events.git` |
| **Feature branch** | `feat/mapview-featured-events` |

---

## Overview

Featured events are highlighted in the map view in two ways:

1. **Map markers** — A featured logo overlay on the location pin.
2. **Mobile carousel** — A “Featured event” tag on carousel cards, with an optional collapse animation when the card is active.

Featured status is determined by the event’s `isFeaturedEvent` or `isFeatured` flag (from API/CMS).

---

## 1. Map markers (desktop & mobile)

**File:** `components/page/events/map-container.tsx`

- **Detection:** When creating a marker, featured status is read as:
  - `event.isFeaturedEvent || event.isFeatured || false`
- **Icon:** `createCustomMarkerIcon(eventImage, isFeatured)` adds an overlay only when featured:
  - For featured events, the pin HTML includes:
    - `<img class="map-marker-pin-image-overlay" src="/icons/featured-logo.svg" alt="Event image overlay" />`
  - Icon is a 36×40 location pin with event image; the overlay is 12×12 at top-right of the pin.
- **Event data on marker:** `eventData: { ...event, isFeatured }` is stored on the marker options so clusters and other logic can use it.
- **CSS:** `.map-marker-pin-image-overlay` positions the overlay (`position: absolute`, top-right, 12×12px).

**Assets:**

- `/icons/featured-logo.svg` — overlay on the map pin.
- `/icons/location-pin.svg` — base pin.
- `/images/event-default.svg` — fallback when event has no image.

---

## 2. Mobile carousel — featured tag

**File:** `components/page/events/map-container.tsx`

On mobile, events are shown in a horizontal carousel at the bottom. Featured events get a tag in the top-right of the card.

- **Detection:** Same as markers: `isFeatured = event.isFeaturedEvent || event.isFeatured || false`.
- **Tag content:**
  - Icon: `/icons/featured-star.svg` (10×10).
  - Text: “Featured event”.
- **Animation (when card is active):**
  - The tag uses `map-mobile-carousel__featured-tag--animate` when `isActive` (current carousel index).
  - After 1.5s, `featured-tag-collapse` runs: text `max-width` goes 80px → 0 and opacity → 0.
  - `featured-tag-shrink-gap` reduces gap and padding so the tag shrinks to icon-only.
  - The tag is keyed with `featured-${event.id ?? event.uid ?? index}-${isActive}` so it remounts when the card becomes active and the animation runs again on scroll.
- **Styling:**
  - Pill in top-right: `border-radius: 0 8px`, gradient background `rgba(233,66,255,0.70)` → `rgba(128,68,213,0.70)`.
  - Text: 10px, font-weight 600, white.

**CSS classes:**

- `.map-mobile-carousel__featured-tag` — container.
- `.map-mobile-carousel__featured-icon` — star icon.
- `.map-mobile-carousel__featured-text` — “Featured event” label.
- `.map-mobile-carousel__featured-tag--animate` — enables collapse/shrink animations.
- Keyframes: `featured-tag-collapse`, `featured-tag-shrink-gap`.

---

## 3. Data flow

- **Source:** Events come from the events service; `isFeaturedEvent` is set from `event?.isFeaturedEvent` (and elsewhere `isFeatured` from `event.is_featured`). Content/schema uses `isFeaturedEvent` (e.g. `schema/collections/events.ts`, event JSON in `content/events/`).
- **Filtering:** The “Show featured events” filter sets `selectedFilterValues.isFeatured`; helpers in `utils/helper.ts` apply this when building filtered lists and from query params (`queryParams.isFeatured`).
- **Types:** `IEvent` / `IEventResponse` in `types/events.type.ts` include `isFeaturedEvent: boolean`.

---

## 4. Files touched by featured map view

| File | Role |
|------|------|
| `components/page/events/map-container.tsx` | Marker icon with featured overlay, carousel featured tag and animations, related CSS |
| `utils/helper.ts` | Featured filter in URL and filtered list |
| `utils/constants.ts` | Featured filter config (name, color, icon) |
| `service/events.service.ts` | Mapping API/CMS `is_featured` / `isFeaturedEvent` into event objects |
| `types/events.type.ts` | `isFeaturedEvent` on event types |
| `schema/collections/events.ts` | CMS field “Is Featured Event” |
| `components/core/filter-box.tsx` | “Show featured events” checkbox |
| `components/page/filter/filter-item.tsx` | Handling `isFeatured` in filter UI |
| `public/icons/featured-logo.svg` | Pin overlay on map |
| `public/icons/featured-star.svg` | Star icon in carousel tag |

---

## 5. Summary

- **Repo:** `https://github.com/memser-spaceport/pln-events.git`  
- **Branch:** `feat/mapview-featured-events`  
- **Map:** Featured events get a small featured-logo overlay on the location pin.  
- **Mobile carousel:** Featured events show a “Featured event” pill (icon + text) that optionally collapses to icon-only when that card is active.
