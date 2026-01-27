import { suggestions } from '@/app/_components/Hero'
import React from 'react'

function EmptyBoxState ( {onSelectOption}:any) {
  return (
    <>
      <div className='mt-7 py-2'>
        <h2 className='font-bold text-3xl text-center py-4'>
          Start planning new <strong className='text-primary'>Trip</strong>{' '}
          using AI
        </h2>
        <p className='text-center mt-2 text-gray'>
          {' '}
          Your own travel companion to personalize plan for your dream travel
          destination effortlessly with the power of A.I. Let us do the hardwork
          and you enjoy the life with your loved ones.
        </p>
      </div>
      <div className='flex flex-col gap-5'>
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => onSelectOption(suggestion.title) }
            className='flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary hover:text-secondary'
          >
            {suggestion.icon}
            <h2 className='text-sm'>{suggestion.title}</h2>
          </div>
        ))}
      </div>
    </>
  )
}

export default EmptyBoxState
