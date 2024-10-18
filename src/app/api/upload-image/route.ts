import dbConnect from "@/app/_lib/database";
import portfolioModel from "@/app/_models/portfolio";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Use formData instead of JSON
    const formData = await request.formData();
    const portfolioId = formData.get('portfolioId') as string;
    const image = formData.get('image');
if (!image ) {
      return NextResponse.json({ msg: 'Image is required' }, { status: 400 });
    }
    const uploadFormData = new FormData();
    uploadFormData.append('image', image);

    // First API request to upload the image
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      uploadFormData
    );
    console.log('response from actual api',response);
    
    // Connect to the database
    await dbConnect();

    // Update the portfolio with the new image URL
    await portfolioModel.findOneAndUpdate(
      { _id: portfolioId },
      { $set: { 'personalInfo.profilePicture': response.data.data.url } }
    );

    // Return a success response
    return NextResponse.json({ msg: 'Image uploaded successfully', url: response.data.data.url }, { status: 200 });
  } catch (error) {
    console.log('Error occurred while uploading Image:', error);
    return NextResponse.json({ msg: 'Error uploading Image' }, { status: 500 });
  }
}
