import { NextRequest, NextResponse } from "next/server";
import { addReview, getPlace } from "@/lib/store";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const place = getPlace(params.id);
  if (!place) return NextResponse.json({ error: "Place not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const author = String(body.author ?? "").slice(0, 60).trim();
  const comment = String(body.comment ?? "").slice(0, 1000).trim();
  const rating = Number(body.rating);
  if (!author || !comment) return NextResponse.json({ error: "Author and comment required" }, { status: 400 });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }
  const pronouns = body.pronouns ? String(body.pronouns).slice(0, 30) : undefined;

  const review = addReview(params.id, { author, comment, rating, pronouns });
  return NextResponse.json({ review }, { status: 201 });
}
