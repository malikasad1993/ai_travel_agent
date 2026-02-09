'use client'
import { Trip } from '@/app/my-trips/page'
import { useTripDetail, useUserDetail } from '@/app/provider'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Itinerary from '@/app/create-new-trip/_components/itinerary'
import GlobalMap from '@/app/create-new-trip/_components/GlobalMap'

function ViewTrip () {
  const { tripid } = useParams()
  const { userDetail, setUserDetail } = useUserDetail()
  const convex = useConvex()
  const [tripData, setTripData] = useState<Trip>()
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail()

  const GetTrip = async () => {
    const result = await convex.query(api.tripPlan.GetTripById, {
      uid: userDetail?._id,
      tripid: tripid + ''
    })
    console.log(result)
    setTripData(result)
    setTripDetailInfo(result?.tripDetail)
  }

  useEffect(() => {
    userDetail && GetTrip()
  }, [userDetail])

  return (
    <div className='grid grid-cols-5'>
      <div className='col-span-3 '>
        <Itinerary />
      </div>
      <div className='col-span-2'>
        <GlobalMap />
      </div>
    </div>
  )
}

export default ViewTrip
