import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadPDFToS3(pdfBuffer, filename) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Body: pdfBuffer,
      ContentType: "application/pdf"
    },
  });

  try {
    const result = await upload.done();
    return result; // This will include the URL of the uploaded file
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error(`Error uploading PDF to S3: ${error.message}`);
  }
}
