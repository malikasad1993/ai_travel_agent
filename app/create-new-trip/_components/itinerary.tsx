'use client'
import { Timeline } from '@/components/ui/timeline'
import HotelCardItem from './HotelCardItem'
import ActivityCardItem from './ActivityCardItem'
import { useTripDetail } from '@/app/provider'
import { useEffect, useState } from 'react'
import { TripInfo } from './ChatBox'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

function itinerary () {
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail()
  const [tripData, setTripData] = useState<TripInfo | null>(null)
  useEffect(() => {
    tripDetailInfo && setTripData(tripDetailInfo)
  }, [tripDetailInfo])
  const data = tripData
    ? [
        {
          title: 'Recommended Hotels',
          content: (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 items-stretch'>
              {tripData?.hotels.map((hotel, index) => (
                <HotelCardItem hotel={hotel} key={index} />
              ))}
            </div>
          )
        },
        ...tripData?.itinerary.map((dayData, index) => ({
          title: `Day ${dayData.day}:`,
          content: (
            <div key={index}>
              <h2 className='text-lg font-semibold '>
                Day Plan: {dayData.day_plan}{' '}
              </h2>
              <p> Best time to visit: {dayData.best_time_to_visit_day}</p>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr'>
                {dayData.activities.map((activity, index) => (
                  <ActivityCardItem activity={activity} key={index} />
                ))}
              </div>
            </div>
          )
        }))
      ]
    : []

  return (
    <div className='relative w-full h-[83vh] overflow-auto '>
      {tripData ? (
        <Timeline data={data} tripData={tripData} />
      ) : (
        <div>
          <Image
            src={'/travel2.jpg'}
            alt={'image'}
            width={800}
            height={800}
            className='w-full h-full items-center object-cover border rounded-3xl'
          />
            <h2 className='flex gap-2 items-center absolute bottom-10 text-3xl'>
                <ArrowLeft/> Build your dream destination plan here!
            </h2>
        </div>
      )}
    </div>
  )
}

export default itinerary

const TripData = {
  budget: 'Low',
  destination: 'Islamabad',
  duration: '2',
  group_size: '2',
  hotels: [
    {
      description:
        'Affordable hotel in central Islamabad with basic amenities and easy access to landmarks.',
      geo_coordinates: {
        latitude: 33.705,
        longitude: 73.055
      },
      hotel_address: 'F-7 Markaz, Islamabad',
      hotel_image_url: 'https://example.com/hotelone.jpg',
      hotel_name: 'Hotel One Super',
      price_per_night: '30 USD',
      rating: 3
    },
    {
      description:
        'Budget-friendly hotel offering comfortable rooms and close to major attractions.',
      geo_coordinates: {
        latitude: 33.693,
        longitude: 73.058
      },
      hotel_address: 'G-6 Markaz, Islamabad',
      hotel_image_url: 'https://example.com/envoycontinental.jpg',
      hotel_name: 'Envoy Continental Hotel',
      price_per_night: '35 USD',
      rating: 3
    },
    {
      description:
        'Economical hotel with clean rooms and convenient location near sightseeing spots.',
      geo_coordinates: {
        latitude: 33.705,
        longitude: 73.047
      },
      hotel_address: 'F-6 Markaz, Islamabad',
      hotel_image_url: 'https://example.com/hotelmargala.jpg',
      hotel_name: 'Hotel Margala',
      price_per_night: '28 USD',
      rating: 3
    }
  ],
  itinerary: [
    {
      activities: [
        {
          best_time_to_visit: 'Morning',
          geo_coordinates: {
            latitude: 33.729,
            longitude: 73.037
          },
          place_address: 'Shah Faisal Ave, Islamabad',
          place_details:
            'Largest mosque in Pakistan with unique architecture and scenic views.',
          place_image_url: 'https://example.com/faisalmosque.jpg',
          place_name: 'Faisal Mosque',
          ticket_pricing: 'Free',
          time_travel_each_location: '30 mins'
        },
        {
          best_time_to_visit: 'Late morning',
          geo_coordinates: {
            latitude: 33.74,
            longitude: 73.054
          },
          place_address: 'Margalla Hills National Park',
          place_details:
            'Hilltop viewpoint offering panoramic views of Islamabad city.',
          place_image_url: 'https://example.com/damanekoh.jpg',
          place_name: 'Daman-e-Koh',
          ticket_pricing: 'Free',
          time_travel_each_location: '20 mins'
        },
        {
          best_time_to_visit: 'Afternoon',
          geo_coordinates: {
            latitude: 33.694,
            longitude: 73.055
          },
          place_address: 'Shakarparian Hills, Islamabad',
          place_details:
            'National monument symbolizing the four provinces of Pakistan.',
          place_image_url: 'https://example.com/pakistanmonument.jpg',
          place_name: 'Pakistan Monument',
          ticket_pricing: 'Free',
          time_travel_each_location: '25 mins'
        },
        {
          best_time_to_visit: 'Afternoon',
          geo_coordinates: {
            latitude: 33.693,
            longitude: 73.056
          },
          place_address: 'Shakarparian Hills, Islamabad',
          place_details:
            "Museum showcasing Pakistan's cultural heritage and traditional arts.",
          place_image_url: 'https://example.com/lokvirsa.jpg',
          place_name: 'Lok Virsa Museum',
          ticket_pricing: 'Varies',
          time_travel_each_location: '30 mins'
        }
      ],
      best_time_to_visit_day: 'Morning to late afternoon',
      day: 1,
      day_plan: 'Explore iconic landmarks and cultural sites in Islamabad.'
    },
    {
      activities: [
        {
          best_time_to_visit: 'Morning',
          geo_coordinates: {
            latitude: 33.678,
            longitude: 73.086
          },
          place_address: 'Rawal Dam Rd, Islamabad',
          place_details:
            'Scenic lake with picnic spots and boating facilities.',
          place_image_url: 'https://example.com/rawallake.jpg',
          place_name: 'Rawal Lake',
          ticket_pricing: 'Free',
          time_travel_each_location: '30 mins'
        },
        {
          best_time_to_visit: 'Late morning',
          geo_coordinates: {
            latitude: 33.753,
            longitude: 72.997
          },
          place_address: 'Shah Allah Ditta Village, Islamabad',
          place_details: 'Ancient Buddhist caves with historical significance.',
          place_image_url: 'https://example.com/shahallahditta.jpg',
          place_name: 'Shah Allah Ditta Caves',
          ticket_pricing: 'Free',
          time_travel_each_location: '40 mins'
        },
        {
          best_time_to_visit: 'Afternoon',
          geo_coordinates: {
            latitude: 33.684,
            longitude: 73.056
          },
          place_address: 'Jinnah Ave, F-8, Islamabad',
          place_details:
            'Popular shopping mall with food courts and entertainment.',
          place_image_url: 'https://example.com/centaurusmall.jpg',
          place_name: 'Centaurus Mall',
          ticket_pricing: 'Free entry',
          time_travel_each_location: '20 mins'
        },
        {
          best_time_to_visit: 'Evening',
          geo_coordinates: {
            latitude: 33.729,
            longitude: 73.061
          },
          place_address: 'Saidpur Village, Islamabad',
          place_details: 'Historic village with traditional food and crafts.',
          place_image_url: 'https://example.com/saidpurvillage.jpg',
          place_name: 'Saidpur Village',
          ticket_pricing: 'Free',
          time_travel_each_location: '30 mins'
        }
      ],
      best_time_to_visit_day: 'Morning to evening',
      day: 2,
      day_plan: 'Visit natural and historical sites with relaxing spots.'
    }
  ],
  origin: 'Karachi',
  preference: 'Sightseeing'
}
