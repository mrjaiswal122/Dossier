import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export function GET(){
cookies().delete('access-token');
return NextResponse.json({msg:'loged out',status:200});
}