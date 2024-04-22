import express from "express";
import Quote from "../models/Quote.js";
import { generatePDF } from "../utils/generatePDF.js";
import { uploadPDFToS3 } from "../utils/uploadPDFToS3.js";

const router = express.Router();

// Get all quotes
router.get("/get-quotes", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving quotes: " + error.message });
  }
});

router.post("/create-quote", async (req, res) => {
  try {
    const newQuote = new Quote(req.body);
    await newQuote.save(); // Save first to get the _id for naming the PDF

    const pdfBuffer = await generatePDF(req.body);
    const filename = `quote-${newQuote._id}.pdf`;
    const uploadResult = await uploadPDFToS3(pdfBuffer, filename);

    newQuote.pdfUrl = uploadResult.Location; // S3 URL of the uploaded file
    await newQuote.save();

    res.status(201).json({
      message: "Quote created and PDF generated and uploaded successfully!",
      data: newQuote,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error processing request", error: error.message });
  }
});

router.get("/pdfs/:fileId", (req, res) => {
  const { fileId } = req.params;
  retrievePDFFromMongoDB(fileId, res);
});

export default router;
