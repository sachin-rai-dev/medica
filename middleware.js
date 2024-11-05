import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/(.*)'])

export default clerkMiddleware((auth, request) => {
 let hospital = request.cookies.get("hospital");
 let person=request.cookies.get("person");

  if (!isPublicRoute(request)) {
    auth().protect()
  }

  if(!hospital && person){
    auth().protect()
  }

  if (auth().userId && request.nextUrl.pathname == "/") {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }
  

})

