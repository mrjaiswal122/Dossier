import { redis } from "@/app/_lib/redis-client";
import { NextRequest, NextResponse } from "next/server";
import { RedisOtp } from "../send-otp/route";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { email, otp } = await req.json();

    // Validate inputs
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }

    // Fetch data from Redis
    const data = await redis.get(email as string);
    if (!data) {
      return NextResponse.json(
        { message: "OTP expired or not found" },
        { status: 404 }
      );
    }

    // Parse Redis data
    const obj = data as RedisOtp

    // Verify OTP
   //otp is string so convert it to Number
    if (Number(otp) === obj.otp) {
      // Mark email as verified
      obj.isEmailVerified = true;

      // Store updated object back in Redis with a reduced TTL
      await redis.setex(email, 300, JSON.stringify(obj));

      return NextResponse.json(
        { success: true, message: "OTP Verified" },
        { status: 200 }
      );
    }

    // Return invalid OTP response
    return NextResponse.json(
      { message: "Invalid OTP." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);

    // Handle unexpected errors
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
