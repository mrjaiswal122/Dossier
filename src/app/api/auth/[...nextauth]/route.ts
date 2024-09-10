import NextAuth,{NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/app/_lib/database";
import userModel from "@/app/_models/user";
const GOOGLE_ID=process.env.GOOGLE_ID!
const GOOGlE_SECRET=process.env.GOOGlE_SECRET!
export const authOptions:NextAuthOptions = {
  session:{
    strategy:'jwt'
  },
    // Configure one or more authentication providers
    providers: [
      GoogleProvider({
        clientId:GOOGLE_ID,
        clientSecret:GOOGlE_SECRET,
      }),
      // ...add more providers here
    ],
    callbacks:{
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
            });
          }
  
          return true;
        } catch (error) {
          console.error('Error storing user in database:', error);
          return false; // Return false to deny sign in if there is an error
        }
      }
    },
  }
  const handler= NextAuth(authOptions);
  export {handler as GET,handler as POST};