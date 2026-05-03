"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import type { Place } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";

function makeIcon(color: string) {
  const html = `
    <div class="vitaj-marker" style="background:${color}">
      <div class="vitaj-marker-inner"></div>
    </div>`;
  return L.divIcon({
    html,
    className: "vitaj-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function FlyTo({ place }: { place: Place | null }) {
  const map = useMap();
  useEffect(() => {
    if (place) map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 11), { duration: 0.8 });
  }, [place, map]);
  return null;
}

type Props = {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function MapView({ places, selectedId, onSelect }: Props) {
  const selected = useMemo(
    () => places.find((p) => p.id === selectedId) ?? null,
    [places, selectedId],
  );

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((p) => {
        const color = CATEGORY_MAP[p.category]?.color ?? "#750787";
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={makeIcon(color)}
            eventHandlers={{ click: () => onSelect(p.id) }}
          />
        );
      })}
      <FlyTo place={selected} />
    </MapContainer>
  );
}
