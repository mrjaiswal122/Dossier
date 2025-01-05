import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_models/user";
import dbConnect from "@/app/_lib/database";
import { verifyToken } from "@/app/_lib/verifyToken";


export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { code: "INVALID_TOKEN", message: "Token is required" },
        { status: 400 }
      );
    }
    const data=verifyToken(token as string);
    if(!data.success){
      return NextResponse.json({code :"INVALID_TOKEN",message:`${data.message}`},{status:401})
    }
    const user = await UserModel.findOne({ email:data.data.email});

    if (!user) {
      return NextResponse.json(
        { code: "INVALID_TOKEN", message: "Invalid verification token" },
        { status: 404 }
      );
    }


      //here data.password is the one time password or verification token 
      if(user.token==data.data.password){

        // Update user
        await UserModel.findByIdAndUpdate(user._id, {
          $set: { isVerified: true },
          $unset: { token: 1 }
        });
        
        
        return NextResponse.json(
          {success:true, message: "Email verified successfully" },
          { status: 200 }
        );

      }else{
         
        return NextResponse.json(
          {code:"INVALID_TOKEN", message: "Verification token mismatch" },
          { status: 403 }
        );
      }

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { code: "ERROR", message: "Server error" },
      { status: 500 }
    );
  }
}