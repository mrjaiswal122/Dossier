import { redis } from "@/app/_lib/redis-client";
import { NextRequest, NextResponse } from "next/server";
import { RedisOtp } from "../send-otp/route";
import dbConnect from "@/app/_lib/database";
import userModel from "@/app/_models/user";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { password, email } = await req.json();

  if (!password || !email)
    return NextResponse.json(
      { message: "Missing credentials" },
      { status: 400 }
    );

  const data = await redis.get(email);
  if (!data) {
    return NextResponse.json({ message: "Session expired." }, { status: 404 });
  }

  const otpData = data as RedisOtp;
  if (!otpData.isEmailVerified) {
    return NextResponse.json(
      { message: "Email verification is required" },
      { status: 400 }
    );
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  await dbConnect();

  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword, salt } },
      { new: true }
    );

    if (user) {
      return NextResponse.json(
        { success: true, message: "Password changed successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error occurred" },
      { status: 500 }
    );
  }
}
