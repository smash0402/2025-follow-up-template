import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userId = request.cookies.get('user_id')

  if (
    pathname === '/' ||
    pathname === '/loginUser' ||
    pathname === '/createUser'
  ) {
    return NextResponse.next()
  }
  if (!userId) {
    return NextResponse.redirect(new URL('/loginUser', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon|.well-known).*)']
}
