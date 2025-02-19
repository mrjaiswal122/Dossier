import dbConnect from "@/lib/database";
import generateSecureNumericPassword from "@/lib/generateOtp";
import { redis } from "@/lib/redis-client";
import { transporter } from "@/lib/transporter";
import userModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export type RedisOtp={
    otp: number;
    isEmailVerified: boolean;
}
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ message: "Email not found" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { message: "Invalid email format" },
      { status: 400 }
    );
  }

  // Connect to the Database
  await dbConnect();
  const user = await userModel.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "No user found" }, { status: 404 });
  }

  if (user.userType === "google") {
    return NextResponse.json(
      { message: "Try logging in with Google" },
      { status: 403 }
    );
  }

  if (!user.isVerified) {
    // TODO: Implement resend verification email feature
    return NextResponse.json(
      { message: "Account not verified. Please verify your account first." },
      { status: 401 }
    );
  }

  // Generate OTP
  const otp = generateSecureNumericPassword();

  try {
    // Store OTP in Redis with a 10-minute expiration
    const obj={otp,isEmailVerified:false}
    await redis.setex(email, 600,JSON.stringify(obj));

    // Send OTP Email
    await transporter.sendMail({
      from: process.env.DOSSIER_EMAIL!,
      to: email,
      subject: "Your OTP for Verification",
      text: `Your One-Time Password (OTP) is: ${otp}. This OTP is valid for 10 minutes.`,
      html: `<p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
             <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>`,
    });

    // Respond with success
    return NextResponse.json(
      {success:true, message: "OTP sent successfully to the registered email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP email:", error);

    // Handle Redis or email errors
    return NextResponse.json(
      { message: "Failed to send OTP. Please try again later." },
      { status: 500 }
    );
  }
}
