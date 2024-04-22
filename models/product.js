import mongoose from "mongoose";
const Schema = mongoose.Schema;

const componentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const documentationSchema = new mongoose.Schema({
  manual: String,
  certification: String,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imgUrl: String,
  components: [componentSchema],
  documentation: documentationSchema,
  dateCreated: { type: Date, default: Date.now },
  dateLastUpdate: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
