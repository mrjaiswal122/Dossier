import {  Upload } from "@/app/_features/portfolio/portfolioSlice";
import dbConnect from "@/app/_lib/database";
import portfolioModel, { IPortfolio } from "@/app/_models/portfolio";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/app/_lib/redis-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";
import userModel, { User } from "@/app/_models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const expTime=Number(process.env.REDIS_EX_TIME!);
 
export async function POST(request: NextRequest) {
  try {
    // Use formData instead of JSON
    const formData = await request.formData();
    const routeName = formData.get('routename') as string;
    const data = formData.get('data') as string;
    const type=formData.get('uploadType') as string;
    
    if(!data) return NextResponse.json({msg:'Data is required',success:false},{status:400});

    // Verify user owns this portfolio
    let user: User|null = null;

    // Check for JWT token in cookies first
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token");

    if (token?.value) {
      // Verify JWT token
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as { userId: string };
      user = await userModel.findOne({ _id: decoded.userId });
    } else {
      // If no JWT token, check for next-auth session
      const session = await getServerSession(authOptions);
      if(!session?.user?.email) {
        return NextResponse.json({success:false, msg:"Unauthorized"}, {status:401});
      }
      user = await userModel.findOne({ email: session.user.email });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if(user.username !== routeName) {
      return NextResponse.json({success:false, msg:"Unauthorized"}, {status:401});
    }

    await dbConnect();
  
    if (Upload.ProfileImage===type){
      const url= data as string
      if (!url) {
        return NextResponse.json({ msg: 'URL is required as Data',success:false }, { status: 400 });
      }

      // Update the portfolio with the new image URL
      await portfolioModel.findOneAndUpdate(
        { routeName },
        { $set: { 'personalInfo.profilePicture':url } }
      );
      
      const cachedPortfolio=await redis.get(routeName)as IPortfolio|null;
      if(cachedPortfolio) {
        const updatedPortfolio=cachedPortfolio;
        updatedPortfolio.personalInfo.profilePicture=url;
        await redis.setex(routeName, expTime,JSON.stringify(updatedPortfolio));
      }
      console.log('image uploaded sucessfull :',url);
      revalidatePath(`/${url.split('.com/')[1]}`,'page')
      // Return a success response
      return NextResponse.json({ msg: 'Image uploaded successfully',success:true}, { status: 200 });

    }
    else if(type===Upload.Project){
      const project=JSON.parse(data) as NonNullable<IPortfolio['projects']>[number];
      if (!project.title || !project.description) {
        return NextResponse.json({ msg: 'Incomplete project data',success:false }, { status: 400 });
      }
      const updatedProjects=await portfolioModel.findOneAndUpdate(
        {routeName},
        {$push:{projects:project}},
        {new:true,projection:{projects:1}}
      );
      
      const cachedPortfolio=await redis.get(routeName)as IPortfolio|null;
      if(cachedPortfolio && updatedProjects) {
        const updatedPortfolio=cachedPortfolio;
        updatedPortfolio.projects=updatedProjects.projects;
        await redis.setex(routeName, expTime,JSON.stringify(updatedPortfolio));
      }

      console.log('project successfully added :',updatedProjects)
      return NextResponse.json({ msg: 'Project Uploaded Successfully',success:true}, { status: 200 });

    }
  } catch (error) {
    console.log('Error occurred while uploading Image:', error);
    return NextResponse.json({ msg: 'Error uploading Image',success:false }, { status: 500 });
  }
}
