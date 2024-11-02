import { UpdateProjectReturnType, Upload } from "@/app/_features/portfolio/portfolioSlice";
import dbConnect from "@/app/_lib/database";
import portfolioModel, { IPortfolio } from "@/app/_models/portfolio";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/app/_lib/redis-client";
const expTime=Number(process.env.REDIS_EX_TIME!);

export async function POST(request: NextRequest) {
  try {
    // Use formData instead of JSON
    const formData = await request.formData();
    const routeName = formData.get('routename') as string;
    const data = formData.get('data') as string;
    const type=formData.get('uploadType') as string;
    

    if(!data)return NextResponse.json({msg:'Data is required'},{status:400})
    // Connect to the database
  
  if (Upload.ProfileImage===type){
    const url= data as string
    if (!url) {
      return NextResponse.json({ msg: 'URL is required as Data' }, { status: 400 });
    }
      await dbConnect();

      // Update the portfolio with the new image URL
      await portfolioModel.findOneAndUpdate(
      { routeName },
      { $set: { 'personalInfo.profilePicture':url } }
      );
      
      const cachedPortfolio=await redis.get(routeName)as IPortfolio|null;
      if(cachedPortfolio) {
        // const updatedPortfolio=JSON.parse(cachedPortfolio);
        const updatedPortfolio=cachedPortfolio;
        updatedPortfolio.personalInfo.profilePicture=url;
        await redis.setex(routeName, expTime,JSON.stringify(updatedPortfolio));
      }
      console.log('image uploaded sucessfull :',url);
      revalidatePath(`/${url.split('.com/')[1]}`,'page')
      // Return a success response
      return NextResponse.json({ msg: 'Image uploaded successfully'}, { status: 200 });

    }
    else if(type===Upload.Project){
      const project=JSON.parse(data) as UpdateProjectReturnType;
      if (!project.title || !project.description) {
        return NextResponse.json({ msg: 'Incomplete project data' }, { status: 400 });
      }
      const updatedProjects=await portfolioModel.findOneAndUpdate(
        {routeName},
        {$push:{projects:project}},
        {new:true,projection:{projects:1}}
      );
      
      const cachedPortfolio=await redis.get(routeName)as IPortfolio|null;
      if(cachedPortfolio && updatedProjects) {
        // const updatedPortfolio=JSON.parse(cachedPortfolio);
        const updatedPortfolio=cachedPortfolio;
        updatedPortfolio.projects=updatedProjects.projects;
        await redis.setex(routeName, expTime,JSON.stringify(updatedPortfolio));
      }

      console.log('project successfully added :',updatedProjects)
      return NextResponse.json({ msg: 'Project Uploaded Successfully'}, { status: 200 });

    }
  } catch (error) {
    console.log('Error occurred while uploading Image:', error);
    return NextResponse.json({ msg: 'Error uploading Image' }, { status: 500 });
  }
}
