import crypto from "crypto";
import UserModel from "@/app/models/user"; // Ensure this uses the updated user model code
import dbConnect from '@/app/lib/database';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();
  
    

    // Generate salt and hash the password
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.createHmac('sha256', salt).update(password).digest('hex');
 console.log(hashedPassword);
 
    // Create the user
    const user = new UserModel({ name, email, password: hashedPassword, salt });
    await user.save();

    console.log('User created successfully');

    // Return the created user (consider omitting sensitive fields)
    return NextResponse.json( { status: 201 });
  } catch (err) {
    console.log(err);

    // Return an error response
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
