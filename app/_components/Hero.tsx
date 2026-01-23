"use client";

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Globe2, Landmark, Plane, Send } from 'lucide-react'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import thumbnail from '@/public/thumbnail.jpg'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


const suggestions = [
  {
    title: 'Create a New Trip',
    icon: <Globe2 className='text-blue-400 h-5 w-5' />
  },
  {
    title: 'Inspire me where to go',
    icon: <Plane className='text-orange-500 h-5 w-5' />
  },
  {
    title: 'Discover Hidden Gems',
    icon: <Landmark className='text-green-500 h-5 w-5' />
  },
  {
    title: 'Adventure Destination',
    icon: <Globe2 className='text-yellow-600 h-5 w-5' />
  }
]

function Hero () {

  const {user} = useUser();
  const router = useRouter();
  const onSend = () =>{
    if(!user){
        router.push('/sign-in')
        return;
    }
  }

  return (
    <div className='mt-26 flex w-full justify-center'>
      {/* {Content} */}
      <div className='max-w-3xl w-full text-center space-y-6'>
        <h1 className='text-xl md:text-5xl font-bold'>
          Hey, I am your personal <br />
          <span className='text-primary'>Travel Agent</span>
        </h1>
        <p className='text-lg'>
          Let me know what&apos;s in your bucket list, and I&apos;ll show you
          the magic🪄<br></br>
          Flights, Hotels, Trip planning - all in just a wind!
        </p>

        {/* {Input Box} */}
        <div>
          <div className='border rounded-2xl p-4 shadow relative'>
            <Textarea
              className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
              placeholder='E.g: Create a trip from Paris to Newyork'
            />

            <Button onClick={()=> onSend()} size={'icon'} className='absolute bottom-6 right-6 cursor-pointer' >
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* {Suggestion Cards} */}

        <div className='flex gap-5'>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className='flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary hover:text-secondary'
            >
              {suggestion.icon}
              <h2 className='text-sm'>{suggestion.title}</h2>
            </div>
          ))}
        </div>

        <h2 className='text-lg text-center'>See Our travel video to get inspire!!⬇️</h2>
        {/* Video Section */}
        <HeroVideoDialog
          className='block dark:hidden'
          animationStyle='from-center'
          videoSrc='https://www.youtube.com/embed/exI_hD_4jAM?si=ituR5LPoa_4HMd3v'
          thumbnailSrc={thumbnail.src}
          thumbnailAlt='Dummy Video'
        />

        {/* Content end */}
              
      </div>

    </div>
  )
}

export default Hero
