import { Experience } from "@/app/_components/portfolio/Experience";
import { Skill } from "@/app/_components/portfolio/Skills";
import { UpdateProfileType } from "@/app/_components/portfolio/UpdateProfile";
import dbConnect from "@/app/_lib/database";
import { redis } from "@/app/_lib/redis-client";
import portfolioModel, { IPortfolio } from "@/app/_models/portfolio";
import userModel from "@/app/_models/user";
import { NextResponse, NextRequest } from "next/server";

const expTime = Number(process.env.REDIS_EX_TIME);

export enum Update {
  Project = 'updating project',
  WorkExperience = 'updating work experience',
  Profile = 'updating hero section',
  RouteName='Changing the routename',
  Skills='Updating skills'
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
      const project = JSON.parse(data) as NonNullable<IPortfolio['projects']>[number];
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
        { $set: { [`experience.${index}`]: experience } },
        { new: true,  }
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
    }
    
  else if (type === Update.RouteName) {
  const newRouteName = data.trim();
  await dbConnect();

  // Check availability using `countDocuments()` for optimized performance
  const isRouteNameTaken = await portfolioModel.countDocuments({ routeName: newRouteName }) > 0;

  if (isRouteNameTaken) {
    return NextResponse.json({ success: false, msg: 'RouteName is not available' }, { status: 409 });
  }

  // Delete the old cache entry in Redis (use `await` if redis is asynchronous)
  redis.del(routeName);

  // Perform both updates concurrently for efficiency
  await Promise.all([
    portfolioModel.findOneAndUpdate({ routeName }, { routeName: newRouteName }),
    userModel.findOneAndUpdate({ username: routeName }, { username: newRouteName })
  ]);

  // Return success response
  return NextResponse.json({ success: true, msg: 'RouteName updated successfully' }, { status: 200 });
}
else if(type==Update.Skills){
const skill = JSON.parse(data) as Skill;
      if (!skill.category || !skill.skills) {
        return NextResponse.json({ success: false, msg: 'Incomplete  skill data' }, { status: 400 });
      }

      await dbConnect();
     

      const updatedSkill = await portfolioModel.findOneAndUpdate(
        { routeName },
        { $set: { [`skills.${index}`]: skill } },
        { new: true,  }
      );
       
      if (updatedSkill) {
        try {
          await redis.del(routeName);
        } catch (redisError) {
          console.error('Redis error:', redisError);
          return NextResponse.json({ success: false, msg: 'Skills updated, but cache invalidation failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, msg: 'Skills updated successfully',  }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, msg: 'Failed to update Skills' }, { status: 404 });
      }
}
else {
      return NextResponse.json({ success: false, msg: 'Invalid update type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in update route:', error);
    return NextResponse.json({ success: false, msg: 'Internal server error' }, { status: 500 });
  }
}
