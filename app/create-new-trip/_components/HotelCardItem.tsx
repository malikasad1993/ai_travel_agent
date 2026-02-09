'use client'
import React, { useEffect, useState } from 'react'
import { Hotel } from './ChatBox'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ExternalLink, Star, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import axios from 'axios'

function HotelCardItem ({ hotel, key }: { hotel: Hotel; key: number }) {
  
  const [photoUrl, setPhotoUrl] = useState<string>();

  const GetGooglePlaceDetail = async () => {
    const placeName = hotel?.hotel_name
    const cacheKey = `photo_${placeName}`

    // Check localStorage for cached photo URL
    const cachedPhoto = localStorage.getItem(cacheKey)
    if (cachedPhoto) {
      setPhotoUrl(cachedPhoto)
      return
    }

    const result = await axios.post('/api/google-place-detail', {
      placeName: hotel?.hotel_name
    })
    
    console.log(result?.data)
    setPhotoUrl(result?.data);
    // Cache the result in localStorage
    if (result?.data) {
      localStorage.setItem(cacheKey, result.data)
    }
  }

  useEffect(() => {
    hotel && GetGooglePlaceDetail()
  }, [hotel])

  return (
    <div>
      <div key={key} className='h-full'>
        <Card className='h-full flex flex-col'>
          <div className='relative w-full h-56'>
            <Image
              src={photoUrl ? photoUrl : '/thumbnail.jpg'}
              alt={hotel?.hotel_name}
              fill
              className='object-cover'
            />
          </div>
          <CardHeader>
            <CardTitle>
              <h2 className='font-semibold text-lg text-primary'>
                {hotel?.hotel_name}
              </h2>
            </CardTitle>

            <CardDescription>
              <h2 className='text-black text-lg'>
                Address: {hotel.hotel_address}
              </h2>
            </CardDescription>
          </CardHeader>

          {/* MAIN CONTENT – allow it to grow */}
          <CardContent className='flex-grow'>
            <p className='text-gray-600'>{hotel?.description}</p>
          </CardContent>

          <CardContent>
            <p className='text-orange-500 flex gap-2 items-center'>
              Ratings: <Star /> {hotel?.rating}
            </p>
          </CardContent>

          {/* FOOTER ALWAYS AT BOTTOM */}
          <CardFooter className='mt-auto'>
            <h2 className='flex gap-2 text-green-400'>
              <Wallet /> {hotel?.price_per_night}
            </h2>
          </CardFooter>

          <CardContent>
            <Link
              href={
                'https://www.google.com/maps/search/?api=1&query=' +
                hotel?.hotel_name
              }
              target='_blank'
            >
              <Button
                variant={'outline'}
                className='bg-primary text-white w-full'
              >
                View <ExternalLink />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HotelCardItem
