import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse, NextRequest } from "next/server";
import { verify, decode, TokenExpiredError } from "jsonwebtoken";
import dbConnect from "@/lib/database";
import userModel from "@/models/user";

export async function GET(request: NextRequest) {
  try {
    // Retrieve token from cookies
    const getToken =await cookies();
    const token = getToken.get("access-token")?.value;

    // Retrieve session from NextAuth
    const session = await getServerSession(authOptions);

    // No token and no session - show signup prompt
    if (!token && !session?.user) {
      return NextResponse.json({ status: 401 });
    }

    // If no token but session exists
    if (!token && session?.user) {
      try {
        await dbConnect(); // Connect to the database
      } catch (error) {
        console.error("Database connection error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
      }

      const user = await userModel.findOne({ email: session.user.email }).select("-_id -password -salt -portfolio").exec();

      if (!user) {
        
        return NextResponse.json({ message: "No user was found" }, { status: 404 });
      }

      return NextResponse.json(
        {
          success:true,
          message: "Show User",
          data: {
            name: session.user.name,
            email: session.user.email,
            imageUrl: session.user?.image,
            role: user.role,
            username: user.username,
            createdAt:new Date(user.createdAt).getTime(),
            updatedAt:new Date(user.updatedAt!).getTime(),
            isVerified:user.isVerified,
            userType:user.userType
          },
        },
        { status: 200 }
      );
    }

    // If token exists, validate it
    if (token) {
      try {
        // Verify the token
        verify(token, process.env.JWT_SECRET as string);

        // Decode token to get user ID
        const tokenData = decode(token);

        if (typeof tokenData === "object" && tokenData !== null) {
          await dbConnect();
          const user = await userModel.findOne({ _id: tokenData.userId }).select("-_id -password -salt -portfolio").exec();

          if (!user) {
            return NextResponse.json({ message: "No user was found" }, { status: 404 });
          }

          const userResponse = {
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            role: user.role,
            username: user.username,
            createdAt:new Date(user.createdAt).getTime(),
            updatedAt:new Date(user.updatedAt!).getTime(),
            isVerified:user.isVerified,
            userType:user.userType
          };

          return NextResponse.json(
            {
              success:true,
              message: "Show User",
              data: userResponse,
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json({ message: "Invalid Token" }, { status: 400 });
        }
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          return NextResponse.json({ message: "Token Expired, Please Login Again" }, { status: 401 });
        } else {
          console.error("Token verification error:", error);
          return NextResponse.json({ message: "Invalid Token" }, { status: 400 });
        }
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
