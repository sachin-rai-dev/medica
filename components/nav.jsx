import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'
import { Button } from './ui/button'

function Nav() {
  return (
    <nav className='flex justify-around py-2 relative z-10 top-0 left-0 '>

        <h1 className='text-white text-2xl font-bold'>logo</h1>

        <div>
        <SignedOut> 
          <SignInButton className="text-white px-5 py-3" />
        </SignedOut>
        <SignedOut>
          <SignUpButton className="text-white border-2 border-white rounded-2xl px-5 py-1 hover:bg-white hover:text-black"/>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        </div>
    </nav>
  )
}

export default Nav