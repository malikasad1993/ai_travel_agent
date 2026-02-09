"use client";

import { useEffect, useState } from "react";
import Chatbox from "./_components/ChatBox";
import Itinerary from "./_components/itinerary";
import { useTripDetail } from "../provider";
import GlobalMap from "./_components/GlobalMap";
import { Button } from "@/components/ui/button";
import { Globe2, Plane } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreateNewTrip() {
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    // ✅ avoid redundant provider state update (prevents an extra rerender)
    if (tripDetailInfo !== null) setTripDetailInfo(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5 p-4 sm:p-6 lg:p-10">
      {/* LEFT: Chat */}
      <div className="md:col-span-2">
        <Chatbox />
      </div>

      {/* RIGHT: Map / Itinerary */}
      <div className="md:col-span-3 relative">
        {/* Give map/itinerary a stable height on mobile */}
        <div className="w-full min-h-[55vh] sm:min-h-[60vh] md:min-h-[calc(100vh-160px)]">
          {activeIndex === 0 ? <Itinerary /> : <GlobalMap />}
        </div>

        {/* Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2">
                <Button
                  className="bg-black hover:bg-gray-700 shadow-lg"
                  size="lg"
                  onClick={() => setActiveIndex((prev) => (prev === 0 ? 1 : 0))}
                  aria-label="Switch between Map and Itinerary"
                >
                  {activeIndex === 0 ? <Plane /> : <Globe2 />}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>Switch Between Map and Trip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
