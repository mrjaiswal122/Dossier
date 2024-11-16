
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/app/_lib/database";
import portfolioModel from "@/app/_models/portfolio";
export  async function POST(request:NextRequest){
    const formData = await request.formData();
    const routeName=formData.get('routeName') as string

try{
    await dbConnect();
  const result= await portfolioModel.findOne({routeName})
  if(result==null){
  
      return NextResponse.json({msg:"Route is available",success:true,
       available:true
      },{status:200})
  }else{


      return NextResponse.json({
        msg:'Route is not available',
        success:false,
        available:false
       },{status:200})
}
}catch(error){
return NextResponse.json({msg:'Internal Server Error' ,success:false,},{status:500})
}
}