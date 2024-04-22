import mongoose from "mongoose";
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  customerDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  quoteItems: [
    {
      itemId: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  taxes: {
    taxName: { type: String, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  total: { type: Number, required: true },
  notes: String,
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, required: true },
  pdfUrl: String,
});

export default mongoose.model("Quote", quoteSchema);
