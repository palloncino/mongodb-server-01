import { MongoClient, GridFSBucket } from "mongodb";

export async function storePDFInMongoDB(pdfBuffer, filename) {
  const client = await MongoClient.connect(process.env.DB_BASE_URL, {
    useUnifiedTopology: true,
  });
  const db = client.db(process.env.DB_NAME);
  const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

  const uploadStream = bucket.openUploadStream(filename);
  uploadStream.end(pdfBuffer);

  await new Promise((resolve, reject) => {
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.on("error", reject);
  });

  client.close();
  return uploadStream.id; // Returns the GridFS file ID
}
