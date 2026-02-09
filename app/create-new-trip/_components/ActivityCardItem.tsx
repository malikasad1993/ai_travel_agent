'use client'
import React, { useEffect, useState } from 'react'
import { Activity, Itinerary } from './ChatBox'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, ExternalLink, Ticket, Timer } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'

function ActivityCardItem ({
  activity,
  key
}: {
  activity: Activity
  key: number
}) {
  
  const [photoUrl, setPhotoUrl] = useState<string>()

  const GetGooglePlaceDetail = async () => {
    const placeName = activity?.place_name + ":" + activity?.place_address
    const cacheKey = `photo_${placeName}`

    // Check localStorage for cached photo URL
    const cachedPhoto = localStorage.getItem(cacheKey)
    if (cachedPhoto) {
      setPhotoUrl(cachedPhoto)
      return
    }

    // If not cached, fetch from API
    const result = await axios.post('/api/google-place-detail', {
      placeName: placeName
    })

    console.log(result?.data)
    setPhotoUrl(result?.data)

    // Cache the result in localStorage
    if (result?.data) {
      localStorage.setItem(cacheKey, result.data)
    }
  }

  useEffect(() => {
    activity && GetGooglePlaceDetail()
  }, [activity])

  return (
    <div>
      <div key={key} className='h-full flex flex-col rounded-lg border p-3'>
        {/* IMAGE */}
        <div className='relative w-full h-48 mb-2'>
          <Image
            src={photoUrl ? photoUrl : '/thumbnail.jpg'}
            alt='activity'
            fill
            className='object-cover rounded'
          />
        </div>

        {/* CONTENT */}
        <h2 className='font-semibold text-lg'>{activity.place_name}</h2>

        <p className='text-gray-500 line-clamp-2'>{activity.place_details}</p>

        <h2 className='text-blue-500 flex gap-2 items-center line-clamp-1 mt-2'>
          <Ticket /> {activity.ticket_pricing}
        </h2>

        <p className='text-orange-400 flex gap-2 items-center mt-2'>
          <Clock /> {activity.time_travel_each_location}
        </p>

        <p className='text-gray-600 flex gap-2 items-center mt-2'>
          <Timer /> {activity.best_time_to_visit}
        </p>

        {/* BUTTON AT BOTTOM */}
        <Link
          href={
            'https://www.google.com/maps/search/?api=1&query=' +
            activity?.place_name
          }
          target='_blank'
        >
          <Button
            variant='outline'
            className='mt-auto w-full bg-primary text-white'
          >
            View <ExternalLink />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ActivityCardItem
