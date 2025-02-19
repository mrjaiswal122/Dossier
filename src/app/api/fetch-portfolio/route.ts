import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import portfolioModel from "@/models/portfolio";
import { redis } from "@/lib/redis-client";
const expTime=Number(process.env.REDIS_EX_TIME!);
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname");

  if (!pathname)
    return NextResponse.json({ msg: "Pathname is required" }, { status: 401 });

  try {
    const cache=await redis.get(`${pathname}`);


    console.log('type of cache',typeof cache);
    
    
    if(cache){
      // const portfolio=await JSON.parse(cache);
      const portfolio=cache
      return NextResponse.json(portfolio, { status: 200 });
    }
    await dbConnect();
    const result = await portfolioModel.findOne({ routeName: pathname }).lean();
    if(result){
    const redisCache= await JSON.stringify(result)
    await redis.setex(`${pathname}`,expTime,redisCache)
    return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json({ msg: "Portfolio not found" }, { status: 404 });
  } catch (error) {
    console.log("Error at api/fetch-portfolio :", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
