import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/database";
import portfolioModel, { IPortfolio } from "@/app/_models/portfolio";
import {
  Delete,
  DeleteImageType,
  Purpose,
} from "@/app/_features/portfolio/portfolioSlice";
import { redis } from "@/app/_lib/redis-client";
import { deleteImage } from "@/app/_lib/s3";

const expTime =Number( process.env.REDIS_EX_TIME!);

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
    if (type == Delete.Project) {
      await dbConnect();
      const portfolio = await portfolioModel.findOne({ routeName });

      if (!portfolio) {
        return NextResponse.json(
          { success: false, error: "Portfolio not found" },
          { status: 404 }
        );
      }

      // Remove the item at the specified index from the `projects` array
      if (portfolio.projects && index >= 0 && index < portfolio.projects.length) {
        const deletedProject = portfolio.projects[index]; // Store the project to delete
        portfolio.projects.splice(index, 1); // Remove the item at the specified index
        await portfolio.save(); // Save the updated document

        // Update Redis cache
        const cachedPortfolio = await redis.get(routeName) as IPortfolio|null;
        if (cachedPortfolio) {
          // const updatedPortfolio = JSON.parse(cachedPortfolio);
          const updatedPortfolio =cachedPortfolio
          updatedPortfolio.projects = portfolio.projects;
          await redis.setex(
            routeName,
            expTime,
            JSON.stringify(updatedPortfolio)
          );
        }

        // Delete image from AWS if it exists
        if (deletedProject.image) {
          await deleteImage(deletedProject.image, Purpose.ProjectImage);
        }

        return NextResponse.json({ success: true, message: "Item deleted" });
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid index" },
          { status: 400 }
        );
      }
    }else if(type == Delete.WorkExperience){
        await dbConnect();
        const portfolio = await portfolioModel.findOne({ routeName });
         if (!portfolio) {
        return NextResponse.json(
          { success: false, error: "Portfolio not found" },
          { status: 404 }
        );
      }

        if (portfolio.experience && index >= 0 && index < portfolio.experience.length) {
        const deletedExperience = portfolio.experience[index]; // Store the project to delete
        portfolio.experience.splice(index, 1); // Remove the item at the specified index
        await portfolio.save(); // Save the updated document

        // Update Redis cache
        const cachedPortfolio = await redis.get(routeName) as IPortfolio|null;
        if (cachedPortfolio) {
          // const updatedPortfolio = JSON.parse(cachedPortfolio);
          const updatedPortfolio =cachedPortfolio
          updatedPortfolio.experience = portfolio.experience;
          await redis.setex(
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
