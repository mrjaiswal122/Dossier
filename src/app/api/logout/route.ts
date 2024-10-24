import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function GET(){
    
   const cookie=await cookies()
   cookie.delete('access-token');
return NextResponse.json({msg:'loged out',status:200});
}