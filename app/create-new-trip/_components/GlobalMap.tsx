"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTripDetail } from "@/app/provider";
import type { Activity, Itinerary } from "./ChatBox";

function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // ✅ store markers so we can clear them on updates
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const { tripDetailInfo } = useTripDetail();

  // 1) Init map ONCE (Strict Mode safe)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_API_KEY in .env.local");
      return;
    }

    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 1.2,
      projection: "globe",
    });

    mapRef.current.on("style.load", () => {
      mapRef.current?.setFog({});
    });

    return () => {
      // cleanup markers + map
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // 2) Add markers whenever tripDetailInfo updates
  useEffect(() => {
    if (!mapRef.current) return;

    // clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!tripDetailInfo?.itinerary?.length) return;

    const bounds = new mapboxgl.LngLatBounds();

    tripDetailInfo.itinerary.forEach((itinerary: Itinerary) => {
      itinerary.activities?.forEach((activity: Activity) => {
        const lng = activity?.geo_coordinates?.longitude;
        const lat = activity?.geo_coordinates?.latitude;

        if (typeof lng !== "number" || typeof lat !== "number") return;

        const marker = new mapboxgl.Marker({ color: "red" })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name))
          .addTo(mapRef.current!); // ✅ correct parentheses

        markersRef.current.push(marker);
        bounds.extend([lng, lat]);
      });
    });

    // zoom map to show all markers
    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { padding: 70, maxZoom: 12 });
    }
  }, [tripDetailInfo]);

  return (
    <div
      ref={mapContainerRef}
      className="map-container"
      style={{
        width: "95%",
        height: "85vh",
        borderRadius: 20,
      }}
    />
  );
}

export default GlobalMap;
