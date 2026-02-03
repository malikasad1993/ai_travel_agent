import React from 'react'
import Chatbox from './_components/ChatBox'
import Itinerary from './_components/itinerary'

export default function CreateNewTrip() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
      <div>
        {/* Chatbox */}
        <Chatbox/>
      </div>
      <div className='col-span-2'>
        {/* Itinerary */}
        <Itinerary />
      </div>
    </div>
  )
}
