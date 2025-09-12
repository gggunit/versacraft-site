import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const [, encoded] = auth.split(' ');
      const [u, p] = atob(encoded).split(':');
      if (u === user && p === pass) return NextResponse.next();
    } catch (error) {
      // Invalid base64 or malformed auth header
    }
  }
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="VersaCraft"' }
  });
}

export const config = {
  matcher: ['/((?!_next|api|public|favicon.ico|robots.txt).*)']
};
