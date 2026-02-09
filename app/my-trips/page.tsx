"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserDetail } from "../provider";
import { TripInfo } from "../create-new-trip/_components/ChatBox";
import MyTripCardItem from "./_components/MyTripCardItem";

export type Trip = {
  tripId: any;
  tripDetail: TripInfo;
  _id: string;
};

function MyTrips() {
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const { userDetail } = useUserDetail();
  const convex = useConvex();

  const GetUserTrip = async () => {
    const result = await convex.query(api.tripPlan.GetUserTrips, {
      uid: userDetail?._id,
    });
    setMyTrips(result);
  };

  useEffect(() => {
    if (userDetail?._id) GetUserTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail?._id]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
      <h2 className="font-bold text-2xl sm:text-3xl text-primary text-center">
        My Trips
      </h2>

      {myTrips.length === 0 && (
        <div className="mt-6 mx-auto max-w-xl p-6 sm:p-8 border rounded-2xl flex flex-col items-center justify-center gap-4">
          <h2 className="font-semibold text-center">
            You don&apos;t have any trip plans.
          </h2>

          <Link href="/create-new-trip">
            <Button>Create New Trip</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
        {myTrips.map((trip) => (
          <MyTripCardItem key={trip._id} trip={trip} />
        ))}
      </div>
    </div>
  );
}

export default MyTrips;
