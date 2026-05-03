import { NextRequest, NextResponse } from "next/server";
import { addPlace, listPlaces } from "@/lib/store";
import { CATEGORY_MAP } from "@/lib/categories";

export async function GET() {
  return NextResponse.json({ places: listPlaces() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const required = ["name", "category", "description", "address", "city", "country", "lat", "lng", "submittedBy"];
  for (const k of required) {
    if (body[k] === undefined || body[k] === null || body[k] === "") {
      return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }
  }
  if (!CATEGORY_MAP[body.category as keyof typeof CATEGORY_MAP]) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (!isFinite(lat) || !isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const place = addPlace({
    name: String(body.name).slice(0, 120),
    category: body.category,
    description: String(body.description).slice(0, 1000),
    address: String(body.address).slice(0, 200),
    city: String(body.city).slice(0, 80),
    country: String(body.country).slice(0, 80),
    lat,
    lng,
    website: body.website ? String(body.website).slice(0, 200) : undefined,
    phone: body.phone ? String(body.phone).slice(0, 40) : undefined,
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 12).map((t: unknown) => String(t).slice(0, 30)) : [],
    submittedBy: String(body.submittedBy).slice(0, 60),
  });
  return NextResponse.json({ place }, { status: 201 });
}
