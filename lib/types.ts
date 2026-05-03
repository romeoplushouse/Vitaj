export type CategoryId =
  | "restaurant"
  | "cafe"
  | "bar"
  | "hotel"
  | "healthcare"
  | "beauty"
  | "trades"
  | "legal"
  | "therapy"
  | "fitness"
  | "shop"
  | "community"
  | "spiritual"
  | "other";

export type Review = {
  id: string;
  placeId: string;
  author: string;
  pronouns?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Place = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  website?: string;
  phone?: string;
  tags: string[];
  friendlinessScore: number;
  submittedBy: string;
  verified: boolean;
  createdAt: string;
  reviews: Review[];
};
