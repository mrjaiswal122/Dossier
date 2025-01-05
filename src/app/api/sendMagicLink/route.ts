import { signToken } from "@/app/_lib/signToken";
import { createTransport } from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_models/user";
import crypto from "crypto"
import dbConnect from "@/app/_lib/database";

interface NodemailerError extends Error {
  code?: string;
  responseCode?: number;
  command?: string;
}

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.DOSSIER_EMAIL,
    pass: process.env.DOSSIER_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 422 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format",},
        { status: 400,}
      );
    }
    await dbConnect();
    
    const existingUser = await UserModel.findOne({ email: email })
    if (existingUser) {
      return NextResponse.json({ msg: "User Already Exists"},{ status: 409 });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      salt,
      token: verificationToken,
      userType: "mannual"
    });
    await user.save();
    //signToken's third parameter is password so be careful while using this 
    const token = await signToken(name, email, verificationToken);
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.DOSSIER_EMAIL,
      to: email,
      subject: "Welcome To Dossier - Verify ",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Dossier!</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${process.env.HOME_URL}/verify-email?token=${token}"
             style="display: inline-block; padding: 10px 20px; background-color: #007bff; 
                    color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p>${process.env.HOME_URL}/verify-email?token=${token}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Verification email sent" },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Error processing the request:", error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      const mailerError = error as NodemailerError;
      if (mailerError.code === 'EAUTH') {
        return NextResponse.json(
          { message: "Email authentication failed. Please check server configuration." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}