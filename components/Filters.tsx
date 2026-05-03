"use client";

import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { Search, X } from "lucide-react";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  selected: Set<CategoryId>;
  toggle: (id: CategoryId) => void;
  clear: () => void;
};

export default function Filters({ query, setQuery, selected, toggle, clear }: Props) {
  return (
    <div className="border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places, cities, tags…"
            className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-9 text-sm outline-none focus:border-pride-purple"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-100"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {selected.size > 0 && (
          <button
            onClick={clear}
            className="text-xs text-neutral-500 underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = selected.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition"
              style={{
                borderColor: active ? c.color : "#e5e5e5",
                background: active ? c.color : "#fff",
                color: active ? "#fff" : "#333",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: active ? "#fff" : c.color }}
              />
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
