import dbConnect from "@/lib/database";
import userModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

// This API takes a pathname and verifies if the user is the owner of the portfolio.
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const pathname = searchParams.get("pathname");

    if (!pathname) {
        return NextResponse.json({ msg: "No pathname found in request URL" }, { status: 404 });
    }

    try {
        const cookiesStore =await cookies();
        const Gettoken = cookiesStore.get("access-token");
        const token = Gettoken?.value;
        
    const session = await getServerSession(authOptions);
    
    if (!session && !token) {
        return NextResponse.json({ isOwner: false }, { status: 200 });
    }

        await dbConnect();

        let user = null;

        if (token) {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return NextResponse.json({ msg: "JWT secret is missing" }, { status: 500 });
            }

            const decoded = verify(token, jwtSecret) as { userId?: string };
            if (decoded?.userId) {
                user = await userModel.findById(decoded.userId);
            }
        } else if (session) {
            user = await userModel.findOne({ email: session.user?.email });
        }

        if (!user) {
            return NextResponse.json({ isOwner: false }, { status: 200 });
        }

        return NextResponse.json({ isOwner: pathname === user.username }, { status: 200 });

    } catch (error) {
        console.error("Error in isOwner API:", error);
        return NextResponse.json({ msg: "Internal server error", isOwner: false }, { status: 200 });
    }
}
