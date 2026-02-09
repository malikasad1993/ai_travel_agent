'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

const menuOptions = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Pricing',
    path: '/pricing'
  },
  {
    name: 'Contact us',
    path: '/contact-us'
  }
]

function Header () {
  const { user } = useUser()
  const path = usePathname()
  // console.log("current route: " ,path)

  return (
    <div className='flex justify-between items-center'>
      {/* LOGO */}
      <Link href='/'>
        <div className='flex gap-2 items-center'>
          <Image src={'/logo.svg'} alt='logo' width={30} height={30}></Image>
          <h2 className='font-bold 2xl:'>AI TRAVEL AGENT</h2>
        </div>
      </Link>

      {/* MENU */}
      <div className='flex gap-5 items-center p-4'>
        {menuOptions.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className='text-lg hover:scale-105 transition-all hover:text-primary'>
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      {/* Get Started Button */}
      <div className='flex gap-5 items-center'>
        {!user ? (
          <SignInButton mode='modal'>
            <Button className='cursor-pointer'>Get Started</Button>
          </SignInButton>
        ) : path == '/create-new-trip' ? (
          <Link href={'/my-trips'}>
            <Button>My Trips</Button>
          </Link>
        ) : (
          <Link href={'/create-new-trip'}>
            <Button>Create New Trip</Button>
          </Link>
        )}
        <UserButton />
      </div>
    </div>
  )
}

export default Header
