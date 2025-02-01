import portfolioModel from "@/app/_models/portfolio";
import dbConnect from "@/app/_lib/database";
import { NextRequest,NextResponse } from "next/server";


export async function GET(req:NextRequest){
try {
    await dbConnect();
    const portfolio_number=await portfolioModel.countDocuments()
    return NextResponse.json({portfolios:portfolio_number,success:true},{status:200})
} catch (error) {
    
    return NextResponse.json({success:false},{status:500})
}


}