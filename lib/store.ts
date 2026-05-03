import fs from "node:fs";
import path from "node:path";
import seed from "@/data/places.json";
import type { Place, Review } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "places.json");

type Store = { places: Place[]; loaded: boolean };

const globalForStore = globalThis as unknown as { __vitajStore?: Store };

function load(): Store {
  if (globalForStore.__vitajStore?.loaded) return globalForStore.__vitajStore;
  const places = (seed as Place[]).map((p) => ({ ...p, reviews: p.reviews ?? [] }));
  const store: Store = { places, loaded: true };
  globalForStore.__vitajStore = store;
  return store;
}

function persist(store: Store) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store.places, null, 2));
  } catch {
    // serverless / read-only filesystems: keep in-memory only
  }
}

export function listPlaces(): Place[] {
  return load().places;
}

export function getPlace(id: string): Place | undefined {
  return load().places.find((p) => p.id === id);
}

export function addPlace(input: Omit<Place, "id" | "createdAt" | "reviews" | "verified" | "friendlinessScore">): Place {
  const store = load();
  const place: Place = {
    ...input,
    id: `p_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    reviews: [],
    verified: false,
    friendlinessScore: 0,
  };
  store.places.unshift(place);
  persist(store);
  return place;
}

export function addReview(placeId: string, input: Omit<Review, "id" | "placeId" | "createdAt">): Review | null {
  const store = load();
  const place = store.places.find((p) => p.id === placeId);
  if (!place) return null;
  const review: Review = {
    ...input,
    id: `r_${Date.now().toString(36)}`,
    placeId,
    createdAt: new Date().toISOString(),
  };
  place.reviews.push(review);
  const total = place.reviews.reduce((s, r) => s + r.rating, 0);
  place.friendlinessScore = Math.round((total / place.reviews.length) * 10) / 10;
  persist(store);
  return review;
}
