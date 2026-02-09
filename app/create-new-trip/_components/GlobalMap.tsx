"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTripDetail } from "@/app/provider";
import type { Activity, Itinerary } from "./ChatBox";

function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);

  const { tripDetailInfo } = useTripDetail();

  const [mapError, setMapError] = useState<string>("");

  // 1) Init map ONCE
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    // ✅ fallback for your earlier env naming issue
    const token =
      process.env.NEXT_PUBLIC_MAPBOX_API_KEY ||
      process.env.NEXT_PUBLIC_MAP_BOX_API_KEY;

    if (!token) {
      setMapError(
        "Missing Mapbox token. Add NEXT_PUBLIC_MAPBOX_API_KEY in .env.local and restart dev server."
      );
      console.error("Missing Mapbox token env var.");
      return;
    }

    mapboxgl.accessToken = token;

    try {
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

      // ✅ Mapbox often needs resize after layout paint (grid/mobile)
      const resizeSoon = () => mapRef.current?.resize();
      const t1 = window.setTimeout(resizeSoon, 80);
      const t2 = window.setTimeout(resizeSoon, 300);

      const onResize = () => mapRef.current?.resize();
      window.addEventListener("resize", onResize);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.removeEventListener("resize", onResize);

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        popupsRef.current.forEach((p) => p.remove());
        popupsRef.current = [];

        mapRef.current?.remove();
        mapRef.current = null;
      };
    } catch (e: any) {
      console.error(e);
      setMapError("Failed to initialize map. Check console for details.");
    }
  }, []);

  // 2) Add markers on trip update
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    popupsRef.current.forEach((p) => p.remove());
    popupsRef.current = [];

    if (!tripDetailInfo?.itinerary?.length) {
      // still resize once to make sure map draws
      window.setTimeout(() => mapRef.current?.resize(), 100);
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    tripDetailInfo.itinerary.forEach((itinerary: Itinerary) => {
      itinerary.activities?.forEach((activity: Activity) => {
        const lng = activity?.geo_coordinates?.longitude;
        const lat = activity?.geo_coordinates?.latitude;
        if (typeof lng !== "number" || typeof lat !== "number") return;

        const popup = new mapboxgl.Popup({ offset: 18 }).setText(
          activity.place_name
        );

        const marker = new mapboxgl.Marker({ color: "red" })
          .setLngLat([lng, lat])
          .addTo(mapRef.current!);

        marker.getElement().addEventListener("click", () => {
          popupsRef.current.forEach((p) => p.remove());
          popupsRef.current = [];
          popup.setLngLat([lng, lat]).addTo(mapRef.current!);
          popupsRef.current.push(popup);
        });

        markersRef.current.push(marker);
        bounds.extend([lng, lat]);
      });
    });

    if (!bounds.isEmpty()) {
      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 640px)").matches;

      mapRef.current.fitBounds(bounds, {
        padding: isMobile ? 40 : 70,
        maxZoom: 12,
      });

      window.setTimeout(() => mapRef.current?.resize(), 180);
    } else {
      window.setTimeout(() => mapRef.current?.resize(), 120);
    }
  }, [tripDetailInfo]);

  return (
    <div className="w-full">
      {/* ✅ Guaranteed visible height on ALL screens */}
      <div
        ref={mapContainerRef}
        className="w-full rounded-2xl overflow-hidden border"
        style={{
          height: "60vh",
          minHeight: 320,
        }}
      />

      {mapError ? (
        <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {mapError}
        </div>
      ) : null}
    </div>
  );
}

export default GlobalMap;
