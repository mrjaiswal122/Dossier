import dbConnect from "@/app/_lib/database";
import userModel from "@/app/_models/user";
import { NextRequest,NextResponse } from "next/server";
import { authOptions } from "@/app/_lib/authOptions";

import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/_lib/verifyToken";

//this api takes pathname and verify is user is the owner of the portfolio ?
export async function GET (request:NextRequest){
const {searchParams}=request.nextUrl;
const pathname=searchParams.get('pathname')
console.log(pathname);

const session=await getServerSession(authOptions);
const Gettoken =(await cookies()).get('access-token');
const token=Gettoken?.value;
console.log(session,token);
if(!pathname){
    console.log('1st');
    
    return NextResponse.json({msg:'No pathname found in request Url'},{status:404})
}
if(!session && !token){
    console.log('2nd');

    return NextResponse.json({isOwner:false},{status:200})
}
try{
await dbConnect();
if(token){
    const decoded=verifyToken(token) ;
    const user =await userModel.findOne({_id:decoded?.userId})
    if(pathname==user.username){
        return NextResponse.json({isOwner:true},{status:200})
    }else{
        return NextResponse.json({isOwner:false},{status:200})
    }
    
}else if(session){
    const user=await userModel.findOne({email:session.user?.email})
    if(pathname==user.username){
        return NextResponse.json({isOwner:true},{status:200})
    }else{
        return NextResponse.json({isOwner:false},{status:200})
    }
}else{
    return NextResponse.json({isOwner:false},{status:200})
}
}catch(error){
    console.log('the error is the isOwner Api :',error);
    return NextResponse.json({msg:'internal server error',isOwner:false},{status:200})   
}

} 