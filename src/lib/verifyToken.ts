import {  verify, JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { CustomJwtPayload } from "./signToken";
type VerifyTokenReturnType = 
  | { success: true; data:  CustomJwtPayload }
  | { success: false; message: string };
export function verifyToken(token:string):VerifyTokenReturnType {
  try {
    const data = verify(token, process.env.JWT_SECRET as string);
    return {success:true,data:data as CustomJwtPayload} 
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log("Error: Token has expired.", error.message);
      return { success: false, message: "Token has expired." };
    } else if (error instanceof NotBeforeError) {
      console.log("Error: Token is not active yet.", error.message);
      return { success: false, message: "Token is not active yet." };
    } else if (error instanceof JsonWebTokenError) {
      console.log("Error: Invalid token.", error.message);
      return { success: false, message: "Invalid token." };
    } else {
      console.log("Unexpected error while verifying the token:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  }
}
