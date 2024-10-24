import  { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/app/_lib/database";
import userModel from "@/app/_models/user";
import { authOptions } from "@/app/_lib/authOptions";
// Ensure your environment variables are set properly



// NextAuth API route
export const handler = NextAuth(authOptions) as never;

export { handler as GET, handler as POST };
