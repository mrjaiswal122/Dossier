import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/database";
import portfolioModel from "@/app/_models/portfolio";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname");

  if (!pathname)
    return NextResponse.json({ msg: "Pathname is required" }, { status: 401 });

  try {
    await dbConnect();
    const result = await portfolioModel.findOne({ routeName: pathname }).lean();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("Error at api/fetch-portfolio :", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
