"use client";

import React, { useEffect, useState } from "react";
import { Hotel } from "./ChatBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Star, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";

function HotelCardItem({ hotel }: { hotel: Hotel }) {
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const GetGooglePlaceDetail = async () => {
    const placeName = hotel?.hotel_name?.trim();
    if (!placeName) return;

    const cacheKey = `photo_${placeName}`;

    // ✅ localStorage is safe here because it's a client component
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
      // fallback to thumbnail
      console.error(e);
    }
  };

  useEffect(() => {
    if (hotel) GetGooglePlaceDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel?.hotel_name]);

  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl">
      {/* Image */}
      <div className="relative w-full h-40 sm:h-52 md:h-56">
        <Image
          src={photoUrl ? photoUrl : "/thumbnail.jpg"}
          alt={hotel?.hotel_name || "Hotel image"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* Header */}
      <CardHeader className="pb-2">
        <CardTitle className="leading-snug">
          <h2 className="font-semibold text-base sm:text-lg text-primary break-words">
            {hotel?.hotel_name}
          </h2>
        </CardTitle>

        <CardDescription className="mt-1">
          <p className="text-sm sm:text-base text-foreground/80 break-words">
            <span className="font-medium">Address:</span> {hotel?.hotel_address}
          </p>
        </CardDescription>
      </CardHeader>

      {/* Description */}
      <CardContent className="flex-grow pb-2">
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed break-words">
          {hotel?.description}
        </p>
      </CardContent>

      {/* Rating + Price */}
      <CardContent className="pt-0 pb-3 space-y-2">
        <p className="text-sm sm:text-base text-orange-500 flex gap-2 items-center">
          <span className="font-medium">Ratings:</span>
          <Star className="h-4 w-4" />
          {hotel?.rating}
        </p>

        <div className="flex items-center gap-2 text-green-500">
          <Wallet className="h-4 w-4" />
          <span className="text-sm sm:text-base font-medium">
            {hotel?.price_per_night}
          </span>
        </div>
      </CardContent>

      {/* Button at bottom */}
      <CardFooter className="mt-auto pt-0">
        <Link
          href={
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(hotel?.hotel_name || "")
          }
          target="_blank"
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            View on Maps <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default HotelCardItem;
