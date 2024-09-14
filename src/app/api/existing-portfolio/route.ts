import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/_lib/database";
import userModel from "@/app/_models/user"; // This is your Mongoose model
import { User } from "@/app/_models/user"; // Assuming you have exported an IUserDocument interface

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ msg: 'Email is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    // Find a user by email
    const user: User | null = await userModel.findOne({ email });

    if (user?.username === '') {
      return NextResponse.json({ msg: 'new user' }, { status: 200 });
    }

    return NextResponse.json({ msg: 'existing user', username: user?.username }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ msg: 'Error fetching user' }, { status: 500 });
  }
}