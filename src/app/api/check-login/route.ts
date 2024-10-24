import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/authOptions";
import { NextResponse, NextRequest } from "next/server";
import { verify, decode, TokenExpiredError } from "jsonwebtoken";
import dbConnect from "@/app/_lib/database";
import userModel from "@/app/_models/user";

export async function GET(request: NextRequest) {
  const Gettoken =await cookies()
  const token=Gettoken.get("access-token")?.value;


  
  const session = await getServerSession(authOptions);

  // console.log('Session:', session);

  if (!token) {
    console.log("Token not found");

    if (!session?.user) {
      console.log("User not found in session, show signup");
      return NextResponse.json({ msg: "Show Signup" }, { status: 200 });
    } else {
      console.log("User found in session, returning user info");
      try{
        
        await dbConnect();
      }catch(error){console.log('Error connecting db :', error)}
      const user = await userModel
        .findOne({ email: session.user.email })
        .exec();

      if (!user) {
        console.log("User not found in database");
        return NextResponse.json({ msg: "Show Signup" }, { status: 200 });
      }

      return NextResponse.json(
        {
          msg: "Show User",
          data: {
            name: session.user.name,
            email: session.user.email,
            imageUrl: session.user?.image,
            role: user.role,
            username:user.username,
          },
        },
        { status: 200 }
      );
    }
  } else {
    try {
      verify(token, process.env.JWT_SECRET as string);
      const tokenData = decode(token);

      if (typeof tokenData === "object" && tokenData !== null) {
        await dbConnect();
        const user = await userModel.findOne({ _id: tokenData.userId }).exec();

        if (!user) {
          console.log("User not found with token ID");
          return NextResponse.json({ msg: "Show Login" }, { status: 200 });
        }
       console.log('sending user .......');
       const obj = {
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        role: user.role,
        username:user.username,
      }
      console.log(JSON.stringify(obj));
        return NextResponse.json(
          {
            msg: "Show User",
            data:obj,
          },
          { status: 200 }
        );
      } else {
        console.log("Token data is invalid");
        return NextResponse.json({ msg: "Show Login" }, { status: 200 });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.log("Token expired");
        return NextResponse.json({ msg: "Show Login" }, { status: 200 });
      } else {
        console.error("Token error:", error);
        return NextResponse.json({ msg: "Show Signup" }, { status: 200 });
      }
    }
  }
}
