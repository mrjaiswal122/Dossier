import { Experience } from "@/app/_components/portfolio/Experience";
import { UpdateProfileType } from "@/app/_components/portfolio/UpdateProfile";
import { UpdateProjectReturnType } from "@/app/_features/portfolio/portfolioSlice";
import dbConnect from "@/app/_lib/database";
import { redis } from "@/app/_lib/redis-client";
import portfolioModel from "@/app/_models/portfolio";
import { NextResponse, NextRequest } from "next/server";

const expTime = Number(process.env.REDIS_EX_TIME);

export enum Update {
  Project = 'updating project',
  WorkExperience = 'updating work experience',
  Profile = 'updating hero section'
}

export async function POST(request: NextRequest) {
  try {
    console.log('I am in the update route');

    const formData = await request.formData();
    const routeName = formData.get('routeName') as string;
    const data = formData.get('data') as string;
    const type = formData.get('updateType') as string;
    const index = Number(formData.get('index'));

    if (!data) return NextResponse.json({ success: false, msg: 'Data is required' }, { status: 400 });

    // Handling project updates
    if (type === Update.Project) {
      const project = JSON.parse(data) as UpdateProjectReturnType;
      if (!project.title || !project.description) {
        return NextResponse.json({ success: false, msg: 'Incomplete project data' }, { status: 400 });
      }

      await dbConnect();
      console.log('Connected to DB in the Update Route for Project');

      const updatedProject = await portfolioModel.findOneAndUpdate(
        { routeName },
        { $set: { [`projects.${index}`]: project } },
        { new: true, projection: { [`projects.${index}`]: 1 } }
      );

      if (updatedProject) {
        console.log('Updated project in the DB, now sending the response');
        try {
          await redis.del(routeName);
        } catch (redisError) {
          console.error('Redis error:', redisError);
          return NextResponse.json({ success: false, msg: 'Project updated, but cache invalidation failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, msg: 'Project updated successfully', project: updatedProject }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, msg: 'Failed to update project' }, { status: 404 });
      }
    }

    // Handling work experience updates
    else if (type === Update.WorkExperience) {
      const experience = JSON.parse(data) as Experience;
      if (!experience.jobTitle || !experience.companyName || !experience.startDate) {
        return NextResponse.json({ success: false, msg: 'Incomplete work experience data' }, { status: 400 });
      }

      await dbConnect();
      console.log('Connected to DB in the Update Route for Work Experience');

      const updatedExperience = await portfolioModel.findOneAndUpdate(
        { routeName },
        { $set: { [`workExperience.${index}`]: experience } },
        { new: true, projection: { [`workExperience.${index}`]: 1 } }
      );

      if (updatedExperience) {
        console.log('Updated work experience in the DB, now sending the response');
        try {
          await redis.del(routeName);
        } catch (redisError) {
          console.error('Redis error:', redisError);
          return NextResponse.json({ success: false, msg: 'Work experience updated, but cache invalidation failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, msg: 'Work experience updated successfully', workExperience: updatedExperience }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, msg: 'Failed to update work experience' }, { status: 404 });
      }
    }

    // Handling profile updates
    else if (type === Update.Profile) {
      const profile = JSON.parse(data) as UpdateProfileType;
      if (!profile.personalInfo.fullName || !profile.personalInfo.email || !profile.personalInfo.title) {
        console.log(profile);
        return NextResponse.json({ success: false, msg: 'Provide all required fields !!' }, { status: 400 });
      }

      await dbConnect();
      console.log('Connected to DB in the Update Route for Profile');

      const updatedProfile = await portfolioModel.findOneAndUpdate(
        { routeName },
        {
          $set: {
            personalInfo: profile.personalInfo,
            summary: profile.summary,
          },
        },
        { new: true, projection: { personalInfo: 1, summary: 1 } }
      );

      if (updatedProfile) {
        console.log('Updated profile in the DB, now sending the response');
        try {
          await redis.del(routeName);
        } catch (redisError) {
          console.error('Redis error:', redisError);
          return NextResponse.json({ success: false, msg: 'Profile updated, but cache invalidation failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, msg: 'Profile updated successfully', profile: updatedProfile }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, msg: 'Failed to update profile' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ success: false, msg: 'Invalid update type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in update route:', error);
    return NextResponse.json({ success: false, msg: 'Internal server error' }, { status: 500 });
  }
}
