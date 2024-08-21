import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { jwtVerify } from 'jose';
export function middleware(request:NextRequest){
const token=cookies().get("access-token");


if (token) {
    try {
      jwtVerify(`${token.value}`,new TextEncoder().encode(process.env.JWT_SECRET as string));
      return NextResponse.next(); // Allow the request to proceed if the token is valid
    } catch (error) {
        if(error instanceof Error){
      if (error.message.includes('jwt expired')) {
        console.error('Token expired:', error);
        return NextResponse.redirect('http://localhost:3000/auth?msg=Session expired, Please Login again.');
      } else {
        console.error('Token verification failed:', error);
        return NextResponse.redirect('http://localhost:3000/auth?msg=Verification failed, Please Login again.');
      }}
    }
  } else {
    console.log('No token found');
    
    return NextResponse.redirect('http://localhost:3000/auth/signup?msg=No session found, Please Signup.');
  }
}
export const config={
    matcher:'/'
}