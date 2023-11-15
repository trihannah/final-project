import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/api/habits/:path*',
};

export function middleware(request: NextRequest) {
  // If you're not modifying the request, you can simply return NextResponse.next()
  return NextResponse.next();
}
