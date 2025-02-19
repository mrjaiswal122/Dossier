import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import portfolioModel, { IPortfolio } from "@/models/portfolio";
import {
  Delete,
  DeleteImageType,
  Purpose,
} from "@/features/portfolio/portfolioSlice";
import { redis } from "@/lib/redis-client";
import { deleteImage } from "@/lib/s3";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import userModel, { User } from "@/models/user";
import { authOptions } from "@/lib/authOptions";

const expTime = Number(process.env.REDIS_EX_TIME!);

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const type = searchParams.get("type"); // e.g., "Project"
  const index = Number(searchParams.get("index")); // e.g., "0"
  const routeName = searchParams.get("routeName");

  // Validate parameters
  if (!type || !routeName || isNaN(index)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing query parameters" },
      { status: 400 }
    );
  }

  try {
    let userEmail: string | null = null;

    // Check for JWT token in cookies first
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token");
    let user:User|null=null;
    // Verify user owns this portfolio
    await dbConnect();
    if (token?.value) {
      // Verify JWT token
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as { userId: string };
       user = await userModel.findOne({ _id: decoded.userId });
      userEmail = user?.email!;
   
    } else {
      // If no JWT token, check for next-auth sessio
      const session = await getServerSession(authOptions);
      userEmail = session?.user?.email || null;
      user = await userModel.findOne({ email: userEmail });
    }
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

   
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const portfolio = await portfolioModel.findOne({ routeName });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Check if logged in user owns this portfolio
    if (portfolio.routeName!== user.username) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (type == Delete.Project) {
      // Remove the item at the specified index from the `projects` array
      if (portfolio.projects && index >= 0 && index < portfolio.projects.length) {
        const deletedProject = portfolio.projects[index]; // Store the project to delete
        portfolio.projects.splice(index, 1); // Remove the item at the specified index
         portfolio.save(); // Save the updated document

        // Update Redis cache
        const cachedPortfolio = await redis.get(routeName) as IPortfolio|null;
        if (cachedPortfolio) {
          const updatedPortfolio = cachedPortfolio;
          updatedPortfolio.projects = portfolio.projects;
           redis.setex(
            routeName,
            expTime,
            JSON.stringify(updatedPortfolio)
          );
        }

        // Delete image from AWS if it exists
        if (deletedProject.image) {
           deleteImage(deletedProject.image, Purpose.ProjectImage);
        }

        return NextResponse.json({ success: true, message: "Item deleted" });
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid index" },
          { status: 400 }
        );
      }
    } else if(type == Delete.WorkExperience) {
        if (portfolio.experience && index >= 0 && index < portfolio.experience.length) {
          const deletedExperience = portfolio.experience[index]; // Store the project to delete
          portfolio.experience.splice(index, 1); // Remove the item at the specified index
           portfolio.save(); // Save the updated document

          // Update Redis cache
          const cachedPortfolio = await redis.get(routeName) as IPortfolio|null;
          if (cachedPortfolio) {
            const updatedPortfolio = cachedPortfolio;
            updatedPortfolio.experience = portfolio.experience;
             redis.setex(
              routeName,
              expTime,
              JSON.stringify(updatedPortfolio)
            );
          }

          return NextResponse.json({ success: true, message: "Item deleted" });
        } else {
          return NextResponse.json(
            { success: false, error: "Invalid index" },
            { status: 400 }
          );
        }
    } else if(type == Delete.Skills) {
        if (portfolio.skills && index >= 0 && index < portfolio.skills.length) {
          const deletedExperience = portfolio.skills[index]; // Store the project to delete
          portfolio.skills.splice(index, 1); // Remove the item at the specified index
           portfolio.save(); // Save the updated document

          // Update Redis cache
          const cachedPortfolio = await redis.get(routeName) as IPortfolio|null;
          if (cachedPortfolio) {
            const updatedPortfolio = cachedPortfolio;
            updatedPortfolio.skills = portfolio.skills;
             redis.setex(
              routeName,
              expTime,
              JSON.stringify(updatedPortfolio)
            );
          }

          return NextResponse.json({ success: true, message: "Item deleted" });
        } else {
          return NextResponse.json(
            { success: false, error: "Invalid index" },
            { status: 400 }
          );
        }
    }
  } catch (err) {
    console.log("Error while deleting->", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
