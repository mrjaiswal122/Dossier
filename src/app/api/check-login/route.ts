import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { verify, decode, TokenExpiredError } from "jsonwebtoken";
import dbConnect from "@/app/lib/database";
import userModel from "@/app/models/user";
import { log } from "console";
export async function GET(request: NextRequest) {
  const token = cookies().get("access-token")?.value;

  if (!token) {
    console.log("token not found");

    return NextResponse.json({ msg: "Show Signup" }, { status: 200 });
  } else {
    try {
      verify(token, `${process.env.JWT_SECRET}`);
      const tokenData = decode(token);
      if (typeof tokenData === "object" && tokenData !== null) {
        await dbConnect();

        // Assuming the token contains a `userID` field
        const user = await userModel.findOne({ _id: tokenData.userId });

        return NextResponse.json(
          {
            msg: "Show User",
            data: {
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
              role: user.role,
            },
          },
          { status: 200 }
        );
      }
      console.log("token is null");

      return NextResponse.json({ msg: "Show Login" }, { status: 200 });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.log("token exprired");

        return NextResponse.json({ msg: "Show Login" }, { status: 200 });
      } else {
        console.log("something happent to token");
        console.log(error);

        return NextResponse.json({ msg: "Show Signup" }, { status: 200 });
      }
    }
  }
}
