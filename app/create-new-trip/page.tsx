'use client'

import { useEffect, useState } from 'react'
import Chatbox from './_components/ChatBox'
import Itinerary from './_components/itinerary'
import { useTripDetail } from '../provider'
import GlobalMap from './_components/GlobalMap'
import { Button } from '@/components/ui/button'
import { Globe2, Plane } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export default function CreateNewTrip () {
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail()
  const [activeIndex, setActiveIndex] = useState(1)

  useEffect(() => {
    // ✅ avoid redundant provider state update (prevents an extra rerender)
    if (tripDetailInfo !== null) setTripDetailInfo(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-5 p-10'>
      <div className='col-span-2'>
        <Chatbox />
      </div>

      <div className='col-span-3 relative cursor-pointer'>
        {activeIndex === 0 ? <Itinerary /> : <GlobalMap />}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='absolute bottom-10 left-1/2 -translate-x-1/2'>
              <Button
                className='bg-black hover:bg-gray-500'
                size='lg'
                onClick={() => setActiveIndex(prev => (prev === 0 ? 1 : 0))}
              >
                {activeIndex === 0 ? <Plane /> : <Globe2 />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Switch Between Map and Trip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
