import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './app/api/auth/[...nextauth]/route';
// Ensure you use this if needed

export async function middleware(request: NextRequest) {
  const token = cookies().get('access-token');
  const homeUrl = process.env.HOME_URL;
  if (!homeUrl) {
    throw new Error('HOME_URL environment variable is not defined.');
  }
  const { pathname } = request.nextUrl;
  const session = await getServerSession(authOptions);

  // To stop the user from going to this route if they are already logged in
  if (pathname === '/auth' || pathname === '/auth/signup' || pathname === '/api/auth/signin') {
    if (token || session?.user) {
      console.log('USER ALREADY LOGGED IN !!');
      // return NextResponse.redirect(new URL(process.env.HOME_URL!, request.url));
      const redirectUrl = new URL(homeUrl);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.log('No user found on the client side');
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth', '/auth/signup', '/api/auth/signin']
};
