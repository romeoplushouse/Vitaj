import "leaflet/dist/leaflet.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vitaj — LGBTQ+ friendly places & services worldwide",
  description:
    "A community-built map of LGBTQ+ friendly places, businesses and services around the world. Find welcoming restaurants, cafes, doctors, salons, electricians and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
