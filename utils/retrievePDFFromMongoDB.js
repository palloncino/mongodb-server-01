import { MongoClient, GridFSBucket, ObjectId } from "mongodb";

export async function retrievePDFFromMongoDB(fileId, res) {
  const client = await MongoClient.connect(process.env.DB_BASE_URL, {
    useUnifiedTopology: true,
  });
  const db = client.db(process.env.DB_NAME);
  const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

  try {
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    // Set headers to prompt download on the client-side
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="quote.pdf"');

    downloadStream.pipe(res);

    downloadStream.on("error", () => {
      res.status(404).json({ message: "File not found" });
    });

    downloadStream.on("finish", () => {
      res.end();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving file", error: error.message });
  } finally {
    client.close();
  }
}
