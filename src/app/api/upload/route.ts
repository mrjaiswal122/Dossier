import { ProjectData } from "@/app/_components/portfolio/Projects";
import { UpdateProjectReturnType, Upload } from "@/app/_features/portfolio/portfolioSlice";
import dbConnect from "@/app/_lib/database";
import portfolioModel from "@/app/_models/portfolio";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Use formData instead of JSON
    const formData = await request.formData();
    const portfolioId = formData.get('portfolioId') as string;
    const data = formData.get('data') as string;
    const type=formData.get('uploadType') as string;
    

    if(!data)return NextResponse.json({msg:'Data is required'},{status:400})
    // Connect to the database
    await dbConnect();
    
    if (Upload.ProfileImage===type){
      const url= data as string
      if (!url) {
        return NextResponse.json({ msg: 'URL is required as Data' }, { status: 400 });
      }

      // Update the portfolio with the new image URL
      await portfolioModel.findOneAndUpdate(
      { _id: portfolioId },
      { $set: { 'personalInfo.profilePicture':url } }
      );
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
        {_id:portfolioId},
        {$push:{projects:project}},
        {new:true,projection:{projects:1}}
      );
      console.log('project successfully added :',updatedProjects)
      return NextResponse.json({ msg: 'Project Uploaded Successfully'}, { status: 200 });

    }
  } catch (error) {
    console.log('Error occurred while uploading Image:', error);
    return NextResponse.json({ msg: 'Error uploading Image' }, { status: 500 });
  }
}
