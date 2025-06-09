import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from './app/api/auth/[...nextauth]/route';

export async function middleware(request: NextRequest) {
  const cookie=await cookies()
  const token=cookie.get('access-token');
  const nextToken =cookie.get('next-auth.session-token');
  

  const { pathname } = request.nextUrl;
  
  // error cause
  // const session = await getServerSession(authOptions);




  // To stop the user from going to this route if they are already logged in
  if (pathname === '/auth' || pathname === '/auth/signup' || pathname === '/api/auth/signin') {
    if (token||nextToken) {
      console.log('USER ALREADY LOGGED IN !!');
     
      return NextResponse.redirect(new URL("/", request.url));
    

    } else {
      console.log('No user found on the client side');
      return NextResponse.next();
    }
  }else if(pathname==='/create-portfolio'){
    if(token||nextToken)
      {
       
      console.log('letting gooo!!!!!');
      
         return NextResponse.next();
    }
    console.log('redirect to home');
    
    // return NextResponse.redirect(new URL(process.env.HOME_URL!+'/auth'));
        return NextResponse.redirect(new URL('/auth', request.url).toString());

  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth', '/auth/signup', '/api/auth/signin','/create-portfolio']
};
