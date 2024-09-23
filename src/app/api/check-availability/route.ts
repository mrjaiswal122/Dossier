
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/app/_lib/database";
import portfolioModel from "@/app/_models/portfolio";
export  async function POST(request:NextRequest){
const {routeName}=await request.json();
console.log(routeName)
try{
    await dbConnect();
  const result= await portfolioModel.findOne({routeName})
  console.log(result)
  if(result==null){
  
      return NextResponse.json({
       available:true
      },{status:200})
  }else{


      return NextResponse.json({
        available:false
       },{status:200})
}
}catch(error){
console.log(error);

}
}