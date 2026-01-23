'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'

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
      <SignInButton mode='modal'>
        <Button className='cursor-pointer'>
          <h2>Get Started</h2>
        </Button>
      </SignInButton>
    </div>
  )
}

export default Header
