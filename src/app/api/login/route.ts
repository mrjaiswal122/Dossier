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
    const user = await userModel.findOne({ email: email })
    if (user) {
      if(user.userType=="google"){
          return NextResponse.json({
            msg:"Try logging with google"
          },{status:409})
      }
         if(user.isVerified==false){
          return NextResponse.json({
            msg:"Account not verified"
          },{status:403})
         }
        const hashedPassword = crypto
        .createHmac("sha256", user.salt!)
        .update(password)
        .digest("hex");
      if (hashedPassword === user.password) {
        
        let jwtToken = sign({ userId: user.id }, `${process.env.JWT_SECRET}`, {
          expiresIn: "12h",
        });
      cookie.set("access-token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge:  12* 60 * 60, //1 days in seconds
          path: "/",
        });
         const userResponse = {
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            role: user.role,
            username: user.username,
            createdAt:new Date(user.createdAt).getTime(),
            updatedAt:new Date(user.updatedAt!).getTime(),
            isVerified:user.isVerified,
            userType:user.userType
          };

        return NextResponse.json({ msg: "User Found",success:true ,user:userResponse }, { status: 200,  headers: {
          'Content-Type': 'application/json'
        } });
      } else {
        return NextResponse.json(
          { msg: "Invalid Password!!" },
          { status: 401}
        );
      }
    } else {
   
        return NextResponse.json({ msg: "No User Found!!" }, { status: 404 });
     
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
