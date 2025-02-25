import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import dbConnect from '@/lib/database';
import userModel from '@/models/user';
import portfolioModel from '@/models/portfolio';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const { data, type, email } = await request.json();

  // Connect to the database
  
  try {
      await dbConnect();
      //this is for if user is logedin using google
    if (type === 1) {
      const session =await getServerSession(authOptions)
      if(!session){
        return NextResponse.json({message:"User not logged in"},{status:401})
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      if(!user.isVerified){
        return NextResponse.json({message:"User not verified"},{status:401})
      }
      if(user.portfolio){
        return NextResponse.json({message:"User already has a portfolio"},{status:401})
      }
      const portfolio = new portfolioModel({
        ...data,
        user: user._id,
      });

      const created= await portfolio.save();
      
      await userModel.findOneAndUpdate({email},{$set:{username:data.routeName,portfolio:created._id}})

      return NextResponse.json({success:true, message: 'Portfolio Created', routename:data.routeName }, { status: 200 });
    }//this is of user is loged in using credentials
    else if (type === 2) {
      const Gettoken =await cookies()
      const token=Gettoken.get("access-token")?.value;

      if (!token) {
        return NextResponse.json({ message: 'Access token not found' }, { status: 401 });
      }

      // Decode the token and directly destructure the userId
      const { userId } = decode(token) as { userId?: string };

      if (!userId) {
        return NextResponse.json({ message: 'Invalid or missing userId in token' }, { status: 400 });
      }
      const user=await userModel.findOne({_id:userId})
      if(!user){
        return NextResponse.json({message:"User not found"},{status:404})
      }
      if(user.portfolio){
        return NextResponse.json({message:"User already has a portfolio"},{status:401})
      }
      const portfolio = new portfolioModel({
        ...data,
        user: userId,
      });

      const created=await portfolio.save();
      //updating the user
      await userModel.findOneAndUpdate({_id:userId},{$set:{username:data.routeName,portfolio:created._id}})

      console.log('Portfolio created for type 2');
      return NextResponse.json({success:true, message: 'Portfolio Created',routename:data.routeName }, { status: 200 });
    } else {
      return NextResponse.json({ status: 400 });
    }
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}
