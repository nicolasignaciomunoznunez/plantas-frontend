// frontend/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /googlebot|bingbot/i.test(userAgent);
  
  if (isBot && url.pathname === '/') {
    url.pathname = '/api/seo';
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/'
};