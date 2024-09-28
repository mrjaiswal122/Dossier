import { JwtPayload, verify } from "jsonwebtoken";
export  function verifyToken(token:string){
    try{

        const data=  verify(token,process.env.JWT_SECRET as string)
        return data as JwtPayload;
    }catch(error){
       console.log('Error while verifying the token :',error);
       
    }

}