"use client";

import { Plus, Heart } from "lucide-react";

type Props = {
  onAddPlace: () => void;
  total: number;
};

export default function Header({ onAddPlace, total }: Props) {
  return (
    <header className="relative z-20 border-b border-neutral-200 bg-white">
      <div className="pride-stripe" />
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full pride-gradient text-white shadow">
            <Heart size={18} fill="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">
              <span className="pride-text">Vitaj</span>
            </h1>
            <p className="text-xs text-neutral-500">
              {total} community-mapped LGBTQ+ friendly places
            </p>
          </div>
        </div>
        <button
          onClick={onAddPlace}
          className="inline-flex items-center gap-2 rounded-full pride-gradient px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95 active:opacity-90"
        >
          <Plus size={16} /> Add a place
        </button>
      </div>
    </header>
  );
}
