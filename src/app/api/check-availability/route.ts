import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import portfolioModel from "@/models/portfolio";
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const routeName = formData.get("routeName") as string;
  if (!routeName)
    return NextResponse.json(
      { msg: "Route name is required", success: false },
      { status: 400 }
    );
  if (routeName.length > 30)
    return NextResponse.json(
      { msg: "Maximum length is 30", success: false },
      { status: 400 }
    );
  try {
    await dbConnect();
    const result = await portfolioModel.findOne({ routeName });
    if (result == null) {
      return NextResponse.json(
        { msg: "Route is available", success: true, available: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          msg: "Route is not available",
          success: false,
          available: false,
        },
        { status: 409 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { msg: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
