import crypto from "crypto";
import UserModel from "@/app/_models/user"; // Ensure this uses the updated user model code
import dbConnect from '@/app/_lib/database';
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();
  
    
    const existingUser =await UserModel.findOne({email: email}).then().catch((err)=>{
      return NextResponse.json({msg:"Something Went Wrong",status:500})
    });

    if(existingUser==null) {
    // Generate salt and hash the password
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.createHmac('sha256', salt).update(password).digest('hex');
    // Create the user
    const user = new UserModel({ name, email, password: hashedPassword, salt });
    await user.save();
    console.log('Account created successfully');
    return NextResponse.json( {msg:'Account Created Successfully'},{ status: 201 });
    }
   return NextResponse.json( {msg:'User Already Exists',status:409 })
  } catch (err) {
    console.log(err);

    // Return an error response
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
