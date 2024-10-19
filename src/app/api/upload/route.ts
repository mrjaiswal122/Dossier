import dbConnect from "@/app/_lib/database";
import portfolioModel from "@/app/_models/portfolio";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Use formData instead of JSON
    const formData = await request.formData();
    const portfolioId = formData.get('portfolioId') as string;
    const url = formData.get('url') as string;
if (!url) {
      return NextResponse.json({ msg: 'URL is required' }, { status: 400 });
    }
   
    
    // Connect to the database
    await dbConnect();
   

    // Update the portfolio with the new image URL
    await portfolioModel.findOneAndUpdate(
      { _id: portfolioId },
      { $set: { 'personalInfo.profilePicture':url } }
    );
    console.log('image uploaded sucessfull :',url);
    revalidatePath(`/${url.split('.com/')[1]}`,'page')
    // Return a success response
    return NextResponse.json({ msg: 'Image uploaded successfully'}, { status: 200 });
  } catch (error) {
    console.log('Error occurred while uploading Image:', error);
    return NextResponse.json({ msg: 'Error uploading Image' }, { status: 500 });
  }
}
