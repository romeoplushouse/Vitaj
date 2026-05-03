"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import Sidebar from "@/components/Sidebar";
import PlaceDetail from "@/components/PlaceDetail";
import SubmitPlaceModal from "@/components/SubmitPlaceModal";
import type { CategoryId, Place, Review } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-500">
      Loading map…
    </div>
  ),
});

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<CategoryId>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/places")
      .then((r) => r.json())
      .then((d) => {
        setPlaces(d.places ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((p) => {
      if (selected.size > 0 && !selected.has(p.category)) return false;
      if (!q) return true;
      const hay = [
        p.name,
        p.description,
        p.city,
        p.country,
        p.address,
        ...(p.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [places, query, selected]);

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedId) ?? null,
    [places, selectedId],
  );

  function toggle(id: CategoryId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onPlaceCreated(p: Place) {
    setPlaces((prev) => [p, ...prev]);
    setSelectedId(p.id);
  }

  function onReviewAdded(placeId: string, review: Review) {
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id !== placeId) return p;
        const reviews = [...p.reviews, review];
        const total = reviews.reduce((s, r) => s + r.rating, 0);
        return {
          ...p,
          reviews,
          friendlinessScore: Math.round((total / reviews.length) * 10) / 10,
        };
      }),
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header onAddPlace={() => setShowSubmit(true)} total={places.length} />
      <Filters
        query={query}
        setQuery={setQuery}
        selected={selected}
        toggle={toggle}
        clear={() => setSelected(new Set())}
      />
      <div className="relative flex flex-1 overflow-hidden">
        <div className="hidden w-[360px] shrink-0 border-r border-neutral-200 bg-white md:block">
          <Sidebar places={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="relative flex-1">
          {!loaded ? (
            <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
              Loading places…
            </div>
          ) : (
            <MapView places={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          )}
          {selectedPlace && (
            <PlaceDetail
              place={selectedPlace}
              onClose={() => setSelectedId(null)}
              onReviewAdded={onReviewAdded}
            />
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 max-h-64 overflow-y-auto border-t border-neutral-200 bg-white md:hidden">
          <Sidebar places={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>
      <SubmitPlaceModal
        open={showSubmit}
        onClose={() => setShowSubmit(false)}
        onCreated={onPlaceCreated}
      />
    </div>
  );
}
