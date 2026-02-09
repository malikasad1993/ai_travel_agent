"use client";

import React, { useEffect, useState } from "react";
import { Trip } from "../page";
import Image from "next/image";
import { ArrowBigRightIcon, Calendar, Wallet } from "lucide-react";
import axios from "axios";
import Link from "next/link";

function MyTripCardItem({ trip }: { trip: Trip }) {
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const GetGooglePlaceDetail = async () => {
    const placeName = trip?.tripDetail?.destination?.trim();
    if (!placeName) return;

    const cacheKey = `photo_${encodeURIComponent(placeName).slice(0, 80)}`;

    const cachedPhoto = localStorage.getItem(cacheKey);
    if (cachedPhoto) {
      setPhotoUrl(cachedPhoto);
      return;
    }

    try {
      const result = await axios.post("/api/google-place-detail", {
        placeName,
      });

      const url = result?.data;
      if (typeof url === "string" && url.length > 0) {
        setPhotoUrl(url);
        localStorage.setItem(cacheKey, url);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (trip?.tripDetail?.destination) GetGooglePlaceDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.tripDetail?.destination]);

  return (
    <Link
      href={"/view-trips/" + trip?.tripId}
      className="
        block h-full rounded-2xl border bg-background shadow-sm overflow-hidden
        transition-transform md:hover:-translate-y-1
      "
    >
      {/* Image */}
      <div className="relative w-full h-44 sm:h-56 md:h-64">
        <Image
          src={photoUrl ? photoUrl : "/travel2.jpg"}
          alt={trip?.tripDetail?.destination || "Trip"}
          fill
          className="object-cover md:hover:scale-105 transition-transform duration-300 ease-in-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-2">
        <h2 className="flex items-center gap-2 font-semibold text-sm sm:text-base">
          <span className="truncate">{trip?.tripDetail?.origin}</span>
          <ArrowBigRightIcon className="h-5 w-5 shrink-0 text-primary" />
          <span className="truncate">{trip?.tripDetail?.destination}</span>
        </h2>

        <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0 text-primary" />
          <span>{trip?.tripDetail?.duration} days</span>
        </div>

        <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
          <Wallet className="h-4 w-4 shrink-0 text-primary" />
          <span className="capitalize">{trip?.tripDetail?.budget} budget</span>
        </div>
      </div>
    </Link>
  );
}

export default MyTripCardItem;
