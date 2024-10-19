'use server';
import { S3Client,PutObjectCommand ,DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dbConnect from "./database";
import portfolioModel from "../_models/portfolio";


//creating the s3 client
const  s3=new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    }
})
//to get the signed url after deleting the previous image if any
export async function getSignedURL(Key:string,oldUrl:string|undefined){
if(oldUrl){
   await deleteImage(oldUrl);
}
const putObjectCommand=new PutObjectCommand({
   Bucket:process.env.S3_BUCKET_NAME!,
   Key,
})
const signedUrl=await getSignedUrl(s3,putObjectCommand,{
expiresIn:60,
})

return `${signedUrl}`;
}


//to delete the image provided the unique name or key 
export async function deleteImage(url:string){

const deleteObjectCommand = new DeleteObjectCommand({
   Bucket:process.env.S3_BUCKET_NAME!,
   Key: url.split('.com/')[1]

});
await s3.send(deleteObjectCommand);

await dbConnect();
const deleteImage=await portfolioModel.findOneAndUpdate({
    'personalInfo.profilePicture':url

},{$set:{ 'personalInfo.profilePicture':''} }
)
}