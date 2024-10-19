'use server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dbConnect from "./database";
import portfolioModel from "../_models/portfolio";

const maxFileSize = 1024 * 1024 * 5; // 5 MB

// Create the S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Get a signed URL for uploading an image to S3
export async function getSignedURL(Key: string, oldUrl: string | undefined, type: string, size: number, checksum: string, portfolioId: string) {
    if (oldUrl) {
        await deleteImage(oldUrl);
    }

    if (size > maxFileSize) return '';
    if (!type.includes('image/')) return '';

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key,
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checksum,
        Metadata: {
            user: portfolioId,
        },
    });

    try {
        const signedUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 });
        return signedUrl;
    } catch (error) {
        console.error("Error getting signed URL:", error);
        return '';
    }
}

// Delete an image by its URL and update the database
export async function deleteImage(url: string) {
    const key = url.split('.com/')[1];
    
    const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
    });

    try {
        await s3.send(deleteObjectCommand);

        await dbConnect();
        await portfolioModel.findOneAndUpdate(
            { 'personalInfo.profilePicture': url },
            { $set: { 'personalInfo.profilePicture': '' } }
        );

        // Optionally return the result of the deletion
        return { success: true, message: "Image has been deleted." };
    } catch (error) {
        console.error("Error deleting image:", error);
        return { success: false, message: "Failed to delete image." };
    }
}
