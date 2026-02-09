"use client";

import React, { useEffect, useState } from "react";
import { Activity } from "./ChatBox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, Ticket, Timer } from "lucide-react";
import Image from "next/image";
import axios from "axios";

function ActivityCardItem({ activity }: { activity: Activity }) {
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const GetGooglePlaceDetail = async () => {
    const name = activity?.place_name?.trim();
    const addr = activity?.place_address?.trim();
    if (!name) return;

    // ✅ Keep cache key small + stable
    const placeKey = `${name}-${addr ?? ""}`.slice(0, 120);
    const cacheKey = `photo_${placeKey}`;

    const cachedPhoto = localStorage.getItem(cacheKey);
    if (cachedPhoto) {
      setPhotoUrl(cachedPhoto);
      return;
    }

    try {
      const placeName = addr ? `${name}: ${addr}` : name;

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
    if (activity?.place_name) GetGooglePlaceDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity?.place_name, activity?.place_address]);

  return (
    <div className="h-full">
      <div className="h-full flex flex-col rounded-2xl border overflow-hidden bg-background">
        {/* IMAGE */}
        <div className="relative w-full h-40 sm:h-48 md:h-52">
          <Image
            src={photoUrl ? photoUrl : "/thumbnail.jpg"}
            alt={activity?.place_name || "activity"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
          />
        </div>

        {/* BODY */}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="font-semibold text-base sm:text-lg leading-snug break-words">
            {activity.place_name}
          </h2>

          <p className="mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-2 break-words">
            {activity.place_details}
          </p>

          <div className="mt-3 space-y-2">
            <div className="text-sm sm:text-base text-blue-500 flex gap-2 items-center line-clamp-1">
              <Ticket className="h-4 w-4" />
              <span className="font-medium">{activity.ticket_pricing}</span>
            </div>

            <div className="text-sm sm:text-base text-orange-500 flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              <span>{activity.time_travel_each_location}</span>
            </div>

            <div className="text-sm sm:text-base text-foreground/70 flex gap-2 items-center">
              <Timer className="h-4 w-4" />
              <span>{activity.best_time_to_visit}</span>
            </div>
          </div>

          {/* BUTTON AT BOTTOM */}
          <div className="mt-4 pt-2 mt-auto">
            <Link
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(activity?.place_name || "")
              }
              target="_blank"
              className="w-full"
            >
              <Button className="w-full">
                View <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCardItem;
