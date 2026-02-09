"use client";

import { Trip } from "@/app/my-trips/page";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Itinerary from "@/app/create-new-trip/_components/itinerary";
import GlobalMap from "@/app/create-new-trip/_components/GlobalMap";

function ViewTrip() {
  const { tripid } = useParams();
  const { userDetail } = useUserDetail();
  const convex = useConvex();

  const [tripData, setTripData] = useState<Trip>();
  const { setTripDetailInfo } = useTripDetail();

  const GetTrip = async () => {
    const result = await convex.query(api.tripPlan.GetTripById, {
      uid: userDetail?._id,
      tripid: String(tripid),
    });

    setTripData(result);
    setTripDetailInfo(result?.tripDetail);
  };

  useEffect(() => {
    if (userDetail?._id && tripid) GetTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail?._id, tripid]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Itinerary */}
        <div className="lg:col-span-3">
          <div className="w-full min-h-[60vh] lg:min-h-[calc(100vh-180px)]">
            <Itinerary />
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="w-full min-h-[55vh] lg:min-h-[calc(100vh-180px)]">
            <GlobalMap />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTrip;
