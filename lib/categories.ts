import type { CategoryId } from "./types";

export type CategoryMeta = {
  id: CategoryId;
  label: string;
  color: string;
  description: string;
};

export const CATEGORIES: CategoryMeta[] = [
  { id: "restaurant", label: "Restaurant", color: "#E40303", description: "Welcoming eateries" },
  { id: "cafe", label: "Cafe", color: "#FF8C00", description: "Coffee and tea spots" },
  { id: "bar", label: "Bar & Nightlife", color: "#750787", description: "Bars, clubs, lounges" },
  { id: "hotel", label: "Hotel & Stay", color: "#004DFF", description: "Accommodation" },
  { id: "healthcare", label: "Healthcare", color: "#0aa66e", description: "Doctors, clinics, dentists" },
  { id: "beauty", label: "Beauty & Hair", color: "#d63384", description: "Salons, barbers, spas" },
  { id: "trades", label: "Trades & Repairs", color: "#6c757d", description: "Electricians, plumbers, builders" },
  { id: "legal", label: "Legal", color: "#2c3e50", description: "Lawyers and notaries" },
  { id: "therapy", label: "Therapy & Counseling", color: "#17a2b8", description: "Mental health support" },
  { id: "fitness", label: "Fitness", color: "#FFED00", description: "Gyms, yoga, sport" },
  { id: "shop", label: "Shops & Retail", color: "#fd7e14", description: "Stores and markets" },
  { id: "community", label: "Community Center", color: "#008026", description: "Support and events" },
  { id: "spiritual", label: "Spiritual", color: "#9b59b6", description: "Affirming places of worship" },
  { id: "other", label: "Other Services", color: "#495057", description: "Anything else" },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, CategoryMeta>,
);
