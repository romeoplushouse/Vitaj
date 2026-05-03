# Vitaj

A community-built map of LGBTQ+ friendly places, businesses and services around the world — restaurants, cafes, bars, hotels, doctors, salons, electricians, lawyers, gyms, community centers and more. Find welcoming spots near you, read community reviews, and contribute new places.

The interface uses the pride flag palette throughout (rainbow header, gradient accents, color-coded category markers).

## Features

- Interactive world map (OpenStreetMap, no API key required)
- 14 service categories with color-coded markers
- Search by name, city, country, or tag
- Multi-select category filters
- Place detail panel with description, address, website, phone, tags
- Community reviews with 1-5 star ratings, name and pronouns
- "Add a place" form so anyone in the community can contribute
- Pride-flag styled UI: rainbow gradient header, prideful tag chips and accents

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- React-Leaflet + OpenStreetMap (free, no API key)
- Tailwind CSS with a pride color palette
- Lucide icons
- File-based JSON store for the MVP (`data/places.json`) — easy to swap for Postgres / Supabase / Mongo later

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment

### On your own VPS

```bash
npm install
npm run build
npm start          # listens on :3000
```

Recommended: run behind nginx/Caddy with HTTPS, and use a process manager such as `pm2` or a `systemd` unit.

Example `systemd` snippet:

```ini
[Service]
WorkingDirectory=/srv/vitaj
ExecStart=/usr/bin/npm start
Environment=NODE_ENV=production
Restart=always
```

The MVP persists submitted places to `data/places.json`. If your filesystem is writable (a normal VPS), submissions and reviews survive restarts. If you deploy to a read-only/serverless host, the in-memory fallback will keep the app working but data resets on redeploy — for that case, swap `lib/store.ts` to a real database.

### On Vercel / serverless

Deploy as-is. Note that the JSON file is read-only in the serverless filesystem, so submissions live in memory until you wire up a database.

### About base44

base44 is primarily a no-code app builder; a full Next.js app with API routes is a better fit for a VPS or Vercel. If you specifically want base44, the data model in `lib/types.ts` and the seed JSON in `data/places.json` can be recreated as base44 entities and bound to a map block, but the rich custom UI and review flow won't transfer one-to-one.

## Project Layout

```
app/
  api/places/route.ts                  GET (list) + POST (create)
  api/places/[id]/reviews/route.ts     POST review
  globals.css                          Pride palette + map styles
  layout.tsx                           Root layout
  page.tsx                             Main map page
components/
  Header.tsx                           Pride-gradient header + Add button
  Filters.tsx                          Search + category chips
  MapView.tsx                          React-Leaflet map
  Sidebar.tsx                          List of filtered places
  PlaceDetail.tsx                      Detail panel with reviews + review form
  SubmitPlaceModal.tsx                 Community submission form
lib/
  types.ts                             Place + Review types
  categories.ts                        Categories with pride colors
  store.ts                             JSON-backed data store
data/
  places.json                          Seed places worldwide
```

## Roadmap Ideas

- Auth (NextAuth) so reviews and submissions are tied to a verified user
- Moderation queue for new submissions and reviews
- Photos and image uploads
- Mobile geolocation + "near me"
- Saved/favorite places, trip planning
- Real database (Postgres + PostGIS for geo queries)
- i18n — the community is global

## Community First

Vitaj only works if the community fills it in. Every place is contributed and rated by people who actually visited. Use the "Add a place" button on any device to share a friendly spot, and leave a review — including pronouns if you'd like — to help the next person.
