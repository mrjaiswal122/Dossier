import  { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/database";
import userModel from "@/models/user";
import { authOptions } from "@/lib/authOptions";
// Ensure your environment variables are set properly



// NextAuth API route
export const handler = NextAuth(authOptions) as never;

export { handler as GET, handler as POST };
