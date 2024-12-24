import dbConnect from "@/app/_lib/database";
import userModel from "@/app/_models/user";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";



export async function POST(req: Request) {
  
  const cookie= await cookies();


  const { email, password } = await req.json();
  const { sign } = jsonwebtoken;

  if (!email || !password) {
    return NextResponse.json(
      { msg: "Email and Password is required!!" },
      { status: 404 }
    );
  }



  try {
    await dbConnect();
    const user = await userModel.findOne({ email: email }) .select('+password +salt +_id')
    if (user && user.salt) {
        const hashedPassword = crypto
        .createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");
      if (hashedPassword === user.password) {
        console.log("good password was matched and it is correct");
        let jwtToken = sign({ userId: user.id }, `${process.env.JWT_SECRET}`, {
          expiresIn: "12h",
        });
      cookie.set("access-token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge:  12* 60 * 60, //1 days in seconds
          path: "/",
        });
        return NextResponse.json({ msg: "User Found" }, { status: 200,  headers: {
          'Content-Type': 'application/json'
        } });
      } else {
        return NextResponse.json(
          { msg: "Invalid Password!!" },
          { status: 200 }
        );
      }
    } else {
        console.log("register yourself");
        return NextResponse.json({ msg: "No User Found!!" }, { status: 200 });
     
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
