"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // ✅ store map instance

  useEffect(() => {
    if (!mapContainerRef.current) return;

    //  Prevent double init (React Strict Mode)
    if (mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY!;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 1.2,
      projection: "globe",
    });

    // Optional: nice globe effect
    mapRef.current.on("style.load", () => {
      mapRef.current?.setFog({});
    });

    // Cleanup (important)
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

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
