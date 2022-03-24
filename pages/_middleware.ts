import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req: any) {
  //Token will exist in the cookie if the user is logged in.
  const token = await getToken({ req, secret: process.env.JWT_SECRET ?? '' })

  //Allow the request to continue if the user is logged in.
  //1. If the user is logged in, the token will exist in the cookie.
  const { pathname } = req.nextUrl
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next() //Allow the request to continue.
  }

  // Redirect to the login page if the user dont have the token AND are requesting a protected route.
  if (!token && pathname !== '/login') {
    return NextResponse.rewrite(new URL('/login', req.url).toString())
  }
}
