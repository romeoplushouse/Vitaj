"use client";

import { useState } from "react";
import type { Place } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { X, Send } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (place: Place) => void;
};

const empty = {
  name: "",
  category: "cafe" as (typeof CATEGORIES)[number]["id"],
  description: "",
  address: "",
  city: "",
  country: "",
  lat: "",
  lng: "",
  website: "",
  phone: "",
  tags: "",
  submittedBy: "",
};

export default function SubmitPlaceModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        tags: form.tags
          .split(",")
          .map((t) => t.trim().replace(/^#/, ""))
          .filter(Boolean),
      };
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not submit");
      onCreated(data.place);
      setForm(empty);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="pride-stripe rounded-t-2xl" />
        <div className="flex items-center justify-between border-b border-neutral-100 p-4">
          <div>
            <h2 className="text-lg font-bold">
              Add a <span className="pride-text">welcoming place</span>
            </h2>
            <p className="text-xs text-neutral-500">
              Help the community discover safe, friendly spots near them.
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-neutral-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Place name *">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Category *">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value as typeof form.category)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Why is it LGBTQ+ friendly? *">
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Owners, policies, vibe, anything you want the community to know."
              className={inputCls}
            />
          </Field>

          <Field label="Address *">
            <input required value={form.address} onChange={(e) => update("address", e.target.value)} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City *">
              <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Country *">
              <input required value={form.country} onChange={(e) => update("country", e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude *" hint="e.g. 52.5200">
              <input
                required
                inputMode="decimal"
                value={form.lat}
                onChange={(e) => update("lat", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Longitude *" hint="e.g. 13.4050">
              <input
                required
                inputMode="decimal"
                value={form.lng}
                onChange={(e) => update("lng", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <p className="text-xs text-neutral-500">
            Tip: right-click in Google Maps and copy the coordinates.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Website">
              <input value={form.website} onChange={(e) => update("website", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
            </Field>
          </div>

          <Field label="Tags" hint="Comma separated. e.g. trans-friendly, queer-owned, wheelchair-accessible">
            <input value={form.tags} onChange={(e) => update("tags", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Your name or alias *">
            <input
              required
              value={form.submittedBy}
              onChange={(e) => update("submittedBy", e.target.value)}
              className={inputCls}
            />
          </Field>

          {error && <p className="text-sm text-pride-red">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm hover:bg-neutral-100">
              Cancel
            </button>
            <button
              disabled={submitting}
              className="inline-flex items-center gap-1 rounded-full pride-gradient px-5 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
            >
              <Send size={14} /> {submitting ? "Submitting…" : "Submit place"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-pride-purple";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-neutral-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-neutral-500">{hint}</span>}
    </label>
  );
}
