import { Experience } from "@/app/_components/portfolio/Experience";
import { Skill } from "@/app/_components/portfolio/Skills";
import { UpdateProfileType } from "@/app/_components/portfolio/UpdateProfile";
import dbConnect from "@/app/_lib/database";
import { redis } from "@/app/_lib/redis-client";
import portfolioModel, { IPortfolio } from "@/app/_models/portfolio";
import userModel, { User } from "@/app/_models/user";
import { NextResponse, NextRequest } from "next/server";
import { Update } from "@/app/_types/Update";
import { authOptions } from "@/app/_lib/authOptions";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
const expTime = Number(process.env.REDIS_EX_TIME);

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const routeName = formData.get('routeName') as string;
    const data = formData.get('data') as string;
    const type = formData.get('updateType') as string;
    const index = Number(formData.get('index'));

   
    if (!data || !type || index === undefined || !routeName) {
      return NextResponse.json({ success: false, msg: 'Missing required fields' }, { status: 400 });
    }
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

    let updateResult;
    let cacheInvalidated = true;

    // Handle different update types
    if (type === Update.Project) {
      const project = JSON.parse(data) as NonNullable<IPortfolio['projects']>[number];
      if (!project.title || !project.description) {
        return NextResponse.json({ success: false, msg: 'Incomplete project data' }, { status: 400 });
      }

      updateResult = await portfolioModel.findOneAndUpdate(
        { routeName },
        { $set: { [`projects.${index}`]: project } },
        { new: true, projection: { [`projects.${index}`]: 1 } }
      );

    } else if (type === Update.WorkExperience) {
      const experience = JSON.parse(data) as Experience;
      if (!experience.jobTitle || !experience.companyName || !experience.startDate) {
        return NextResponse.json({ success: false, msg: 'Incomplete work experience data' }, { status: 400 });
      }

      updateResult = await portfolioModel.findOneAndUpdate(
        { routeName },
        { $set: { [`experience.${index}`]: experience } },
        { new: true }
      );

    } else if (type === Update.Profile) {
      const profile = JSON.parse(data) as UpdateProfileType;
      if (!profile.personalInfo.fullName || !profile.personalInfo.email || !profile.personalInfo.title) {
        return NextResponse.json({ success: false, msg: 'Provide all required fields !!' }, { status: 400 });
      }

      updateResult = await portfolioModel.findOneAndUpdate(
        { routeName },
        {
          $set: {
            personalInfo: profile.personalInfo,
            summary: profile.summary,
          },
        },
        { new: true, projection: { personalInfo: 1, summary: 1 } }
      );

    } else if (type === Update.RouteName) {
      const newRouteName = data.trim();
      const isRouteNameTaken = await portfolioModel.countDocuments({ routeName: newRouteName }) > 0;

      if (isRouteNameTaken) {
        return NextResponse.json({ success: false, msg: 'RouteName is not available' }, { status: 409 });
      }

      await Promise.all([
        portfolioModel.findOneAndUpdate({ routeName }, { routeName: newRouteName }),
        userModel.findOneAndUpdate({ username: routeName }, { username: newRouteName })
      ]);

      updateResult = { success: true };

    } else if(type === Update.Skills) {
      const skill = JSON.parse(data) as Skill;
      if (!skill.category || !skill.skills) {
        return NextResponse.json({ success: false, msg: 'Incomplete skill data' }, { status: 400 });
      }

      updateResult = await portfolioModel.findOneAndUpdate(
        { routeName },
        { $set: { [`skills.${index}`]: skill } },
        { new: true }
      );

    } else {
      return NextResponse.json({ success: false, msg: 'Invalid update type' }, { status: 400 });
    }

    if (!updateResult) {
      return NextResponse.json({ success: false, msg: `Failed to update ${type}` }, { status: 404 });
    }

    try {
      await redis.del(routeName);
    } catch (redisError) {
      console.error('Redis error:', redisError);
      cacheInvalidated = false;
    }

    return NextResponse.json({ 
      success: true, 
      msg: cacheInvalidated ? `${type} updated successfully` : `${type} updated but cache invalidation failed`,
      data: updateResult
    }, { status: 200 });

  } catch (error) {
    console.error('Error in update route:', error);
    return NextResponse.json({ success: false, msg: 'Internal server error' }, { status: 500 });
  }
}
