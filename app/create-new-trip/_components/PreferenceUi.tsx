import React, { useState } from 'react'

function PreferenceUi ({ onSelectedOption }: any){
    return(
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 items-center mt-1'>
                {SelectPreferenceList.map((item,index) => (
                    <div 
                      key={index} 
                      className='p-3 border rounded-2xl bg-white hover:border-primary cursor-pointer'
                      onClick={() => onSelectedOption(item.title+ ": "+item.desc)}>
                        <h2>{item.icon}</h2>
                        <h2>{item.title}</h2>
                        <p className='text-sm text-gray-500'>{item.desc}</p>
                    </div>
                ))}
        </div>
    )

}

export default PreferenceUi

export const SelectPreferenceList = [
  {
    id: 1,
    title: 'adventure',
    desc: 'An Adventure trip exploring beach, mountains and more',
    icon: '🚵',
  },
  {
    id: 2,
    title: 'sightseeing',
    desc: 'Travel plans focused on exploring famous landmarks and attractions',
    icon: '🏛️',
  },
  {
    id: 3,
    title: 'cultural',
    desc: 'Immerse in local traditions, arts, and heritage',
    icon: '🧫',
  },
  {
    id: 4,
    title: 'food',
    desc: 'Culinary journey to savor local and exotic cuisines',
    icon: '🍉',
  },
  {
    id: 5,
    title: 'nightlife',
    desc: 'Experience vibrant nightlife with clubs, bars, and entertainment',
    icon: '🍸',
  },
  {
    id: 6,
    title: 'Mix of everything',
    desc: 'Mix of adventure, sightseeing, culture, food, and nightlife',
    icon: '⛵',
  }


]

