import { Experience } from "@/app/_components/portfolio/Experience";
import { UpdateProjectReturnType } from "@/app/_features/portfolio/portfolioSlice";
import dbConnect from "@/app/_lib/database";
import { redis } from "@/app/_lib/redis-client";
import portfolioModel from "@/app/_models/portfolio";
import { NextResponse,NextRequest } from "next/server";
const expTime=Number(process.env.REDIS_EX_TIME);
export enum Update{
Project='updating project',
WorkExperience='updating work experience'

}
export  async function POST(request: NextRequest){
   try{

    console.log('I am in the update route');
    
   const formData= await request.formData();
   const routeName=formData.get('routeName') as string;
   const data = formData.get('data') as string;
   const type=formData.get('updateType') as string;
   const index=Number(formData.get('index'));

   if(!data)return NextResponse.json({success:false,msg:'Data is required'},{status:400})

   if(type==Update.Project){
      const project=JSON.parse(data) as UpdateProjectReturnType;
      if (!project.title ||!project.description) {
        return NextResponse.json({success:false, msg: 'Incomplete project data' }, { status: 400 });
      }
      await dbConnect();
      console.log('Connecte to DB in the Update Route-----');
      
      const updatedProject= await portfolioModel.findOneAndUpdate(
        {routeName},
        {$set:{[`projects.${index}`]:project}},
        {new:true,projection:{[`projects.${index}`]:1}}

      );
     console.log('Updated in the DB now sending the response')
       // Use try-catch specifically for Redis operation
      try {
        await redis.del(routeName);
      } catch (redisError) 
      {
        console.error('Redis error:', redisError);
        // Continue execution even if Redis fails
      }
      return NextResponse.json({success:true,msg:'Project updated successfully'},{status:200})
     }
   else if(type==Update.WorkExperience){
    const experience=JSON.parse(data) as Experience;
    if(!experience.jobTitle || !experience.companyName && !experience.startDate){
      return NextResponse.json({success:false, msg: 'Incomplete work experience data' }, { status: 400 });
    }
    try {
      await redis.del(routeName);
    } catch (redisError){
      console.error('Redis error:', redisError);
      return NextResponse.json({success:false,msg:'Unable to delete cache'},{status:404})
    }
    await dbConnect();
    const updatedWorkExperience= await portfolioModel.findOneAndUpdate(
      {routeName},
      {$set:{[`experience.${index}`]:experience}},
      {new:true,projection:{'experience':1}}
    ).lean();
    //deleting redis cahche
    return NextResponse.json({success:true,msg:'Updated experiemce successfully'},{status:200})
     }

   }catch(e){
       console.log('Error occurred while updating ->:', e);
    return NextResponse.json({success:false, msg: 'Error updating' }, { status: 500 });
   }
   }
