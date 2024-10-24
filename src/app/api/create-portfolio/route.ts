import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import dbConnect from '@/app/_lib/database';
import userModel from '@/app/_models/user';
import portfolioModel from '@/app/_models/portfolio';

export async function POST(request: Request) {
  const { data, type, email } = await request.json();

  // Connect to the database
  
  try {
      await dbConnect();
      //this is for if user is logedin using google
    if (type === 1) {
      const user = await userModel.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const portfolio = new portfolioModel({
        ...data,
        user: user._id,
      });

      const created= await portfolio.save();
      console.log('portfolo:',created)
      //updating the user 
      await userModel.findOneAndUpdate({email},{$set:{username:data.routeName,portfolios:created._id}})

      console.log('Portfolio created for type 1');
      return NextResponse.json({ message: 'Portfolio Created' }, { status: 200 });
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

      const portfolio = new portfolioModel({
        ...data,
        user: userId,
      });

      const created=await portfolio.save();
      //updating the user
      await userModel.findOneAndUpdate({_id:userId},{$set:{username:data.routeName,portfolios:created._id}})

      console.log('Portfolio created for type 2');
      return NextResponse.json({ message: 'Portfolio Created' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}
