"use client";

import type { Place } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { Star, MapPin, ShieldCheck } from "lucide-react";

type Props = {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function Sidebar({ places, selectedId, onSelect }: Props) {
  if (places.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-500">
        No places match your filters yet. Be the first to add one!
      </div>
    );
  }
  return (
    <ul className="scrollbar-thin h-full divide-y divide-neutral-100 overflow-y-auto">
      {places.map((p) => {
        const cat = CATEGORY_MAP[p.category];
        const active = p.id === selectedId;
        return (
          <li key={p.id}>
            <button
              onClick={() => onSelect(p.id)}
              className={`block w-full px-4 py-3 text-left transition ${
                active ? "bg-neutral-50" : "hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: cat?.color ?? "#999" }}
                    />
                    <span className="truncate text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {cat?.label ?? p.category}
                    </span>
                    {p.verified && (
                      <ShieldCheck size={12} className="text-pride-green" aria-label="Verified" />
                    )}
                  </div>
                  <h3 className="mt-0.5 truncate font-semibold text-neutral-900">{p.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-500">
                    <MapPin size={12} /> {p.city}, {p.country}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-700">{p.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs">
                  <Star size={12} className="text-pride-orange" fill="currentColor" />
                  <span className="font-semibold">
                    {p.friendlinessScore > 0 ? p.friendlinessScore.toFixed(1) : "—"}
                  </span>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
