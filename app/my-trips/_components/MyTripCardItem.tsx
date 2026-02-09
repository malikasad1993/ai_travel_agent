import React, { useEffect, useState } from 'react'
import { Trip } from '../page'
import Image from 'next/image'
import { ArrowBigRightIcon, Calendar, Wallet, Wallet2 } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'



function MyTripCardItem({trip}: {trip:Trip}) {

  const [photoUrl, setPhotoUrl] = useState<string>()

  const GetGooglePlaceDetail = async () => {
    const placeName = trip?.tripDetail.destination
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
    trip && GetGooglePlaceDetail()
  }, [trip])
  
    return (
    <div>
      <Link href={'/view-trips/'+trip?.tripId} className='p-5 shadow rounded-2xl h-full'>
            <Image src={photoUrl ? photoUrl : '/travel2.jpg'} alt={trip?.tripId} width={400} height={400}
            className='rounded-2xl object-cover w-full h-[270px] cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out'/>
            <h2 className='flex gap-2 font-semibold mt-2'>{trip?.tripDetail?.origin}<ArrowBigRightIcon/>{trip?.tripDetail?.destination}</h2>
            <h2 className='flex gap-2 font-semibold'><Calendar/>{trip?.tripDetail?.duration}</h2>
            <h2 className='flex gap-2 font-semibold'><Wallet/>{trip?.tripDetail?.budget} budget</h2>
            
          </Link>
    </div>
  )
}

export default MyTripCardItem
