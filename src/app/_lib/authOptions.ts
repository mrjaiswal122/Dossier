import { NextAuthOptions } from "next-auth";
import userModel from "../_models/user";
import dbConnect from "./database";
import GoogleProvider from "next-auth/providers/google";
const GOOGLE_ID = process.env.GOOGLE_ID!;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET!;
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // Connect to the database
        await dbConnect();

        // Check if the user already exists in the database
        const existingUser = await userModel.findOne({ email: user.email });

        if (!existingUser) {
          // Create a new user in the database if they don't exist
          await userModel.create({
            name: user.name,
            email: user.email,
            imageUrl: user.image,
            isVerified:true,
            userType:"google"
          });
          return true; // User successfully signed in
        }
         return false;
      } catch (error) {
        console.error('Error storing user in database:', error);
        return false; // Return false to deny sign-in if there is an error
      }
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
};
