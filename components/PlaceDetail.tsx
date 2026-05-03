"use client";

import { useState } from "react";
import type { Place, Review } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { Star, MapPin, Globe, Phone, ShieldCheck, X, Send } from "lucide-react";

type Props = {
  place: Place;
  onClose: () => void;
  onReviewAdded: (placeId: string, review: Review) => void;
};

export default function PlaceDetail({ place, onClose, onReviewAdded }: Props) {
  const cat = CATEGORY_MAP[place.category];
  const [author, setAuthor] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/places/${place.id}/reviews`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ author, pronouns, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not submit review");
      onReviewAdded(place.id, data.review);
      setAuthor("");
      setPronouns("");
      setComment("");
      setRating(5);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="absolute inset-x-0 bottom-0 z-10 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t-4 bg-white shadow-2xl pride-border md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[420px] md:max-h-none md:rounded-none md:border-l-4 md:border-t-0">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-neutral-100 bg-white p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: cat?.color }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: cat?.color }} />
            {cat?.label}
            {place.verified && (
              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-pride-green/10 px-2 py-0.5 text-[10px] text-pride-green">
                <ShieldCheck size={10} /> Verified
              </span>
            )}
          </div>
          <h2 className="mt-1 truncate text-xl font-bold">{place.name}</h2>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-neutral-600">
            <MapPin size={14} /> {place.address}, {place.city}, {place.country}
          </p>
        </div>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-neutral-100" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-neutral-800">{place.description}</p>

        {(place.website || place.phone) && (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 hover:bg-neutral-50"
              >
                <Globe size={14} /> Website
              </a>
            )}
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 hover:bg-neutral-50"
              >
                <Phone size={14} /> {place.phone}
              </a>
            )}
          </div>
        )}

        {place.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {place.tags.map((t) => (
              <span key={t} className="rounded-full pride-gradient-soft px-2 py-0.5 text-xs text-neutral-800">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Community reviews</h3>
            <span className="inline-flex items-center gap-1 text-sm">
              <Star size={14} className="text-pride-orange" fill="currentColor" />
              <span className="font-semibold">
                {place.friendlinessScore > 0 ? place.friendlinessScore.toFixed(1) : "No ratings yet"}
              </span>
              <span className="text-neutral-400">({place.reviews.length})</span>
            </span>
          </div>

          <ul className="mt-2 space-y-2">
            {place.reviews.length === 0 && (
              <li className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
                Be the first to share your experience.
              </li>
            )}
            {place.reviews.map((r) => (
              <li key={r.id} className="rounded-lg border border-neutral-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    {r.author}{" "}
                    {r.pronouns && (
                      <span className="text-xs font-normal text-neutral-500">({r.pronouns})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < r.rating ? "text-pride-orange" : "text-neutral-200"}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-neutral-700">{r.comment}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>

          <form onSubmit={submit} className="mt-4 rounded-xl border border-neutral-200 p-3">
            <h4 className="text-sm font-semibold">Leave a review</h4>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="Your name or alias"
                className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm outline-none focus:border-pride-purple"
              />
              <input
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                placeholder="Pronouns (optional)"
                className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm outline-none focus:border-pride-purple"
              />
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`Rate ${n}`}
                  className="p-1"
                >
                  <Star
                    size={20}
                    className={n <= rating ? "text-pride-orange" : "text-neutral-300"}
                    fill="currentColor"
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              placeholder="Share what made it welcoming. Was the staff respectful? Pronouns asked? Any caveats?"
              className="mt-2 w-full rounded-md border border-neutral-200 px-2 py-1.5 text-sm outline-none focus:border-pride-purple"
            />
            {error && <p className="mt-1 text-xs text-pride-red">{error}</p>}
            <button
              disabled={submitting}
              className="mt-2 inline-flex items-center gap-1 rounded-full pride-gradient px-4 py-1.5 text-sm font-semibold text-white shadow disabled:opacity-60"
            >
              <Send size={14} /> {submitting ? "Posting…" : "Post review"}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
