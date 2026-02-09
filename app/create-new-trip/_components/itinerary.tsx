"use client";

import { Timeline } from "@/components/ui/timeline";
import HotelCardItem from "./HotelCardItem";
import ActivityCardItem from "./ActivityCardItem";
import { useTripDetail } from "@/app/provider";
import { useEffect, useMemo, useState } from "react";
import { TripInfo } from "./ChatBox";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

function Itinerary() {
  const { tripDetailInfo } = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo | null>(null);

  useEffect(() => {
    if (tripDetailInfo) setTripData(tripDetailInfo);
  }, [tripDetailInfo]);

  const data = useMemo(() => {
    if (!tripData) return [];

    return [
      {
        title: "Recommended Hotels",
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
            {tripData.hotels?.map((hotel) => (
              <HotelCardItem hotel={hotel} />
            ))}
          </div>
        ),
      },
      ...tripData.itinerary.map((dayData, index) => ({
        title: `Day ${dayData.day}:`,
        content: (
          <div key={index} className="space-y-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold leading-snug">
                Day Plan: {dayData.day_plan}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Best time to visit: {dayData.best_time_to_visit_day}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 auto-rows-fr">
              {dayData.activities?.map((activity, index) => (
                <ActivityCardItem activity={activity} />
              ))}
            </div>
          </div>
        ),
      })),
    ];
  }, [tripData]);

  return (
    <div className="relative w-full">
      {tripData ? (
        // ✅ Timeline often needs padding on mobile to avoid edge-to-edge feel
        <div className="w-full h-[60vh] sm:h-[65vh] md:h-[calc(100vh-170px)] overflow-auto px-4 sm:px-6 py-4">
          <Timeline data={data} tripData={tripData} />
        </div>
      ) : (
        <div className="relative w-full h-[60vh] sm:h-[65vh] md:h-[calc(100vh-170px)] rounded-3xl overflow-hidden border">
          <Image
            src="/travel2.jpg"
            alt="travel"
            fill
            className="object-cover"
            priority
          />

          {/* overlay for readability */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-6">
            <div className="mx-auto max-w-2xl rounded-2xl bg-background/85 backdrop-blur border p-4 sm:p-5">
              <h2 className="flex gap-2 items-center text-base sm:text-lg md:text-xl font-semibold">
                <ArrowLeft className="h-5 w-5" />
                Build your dream destination plan here!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Start the chat on the left to generate your itinerary and hotels.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Itinerary;
