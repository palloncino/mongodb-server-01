import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import quotesRoutes from "./routes/quotesRoutes.js";

const app = express();
const PORT = process.env.PORT || 4023;

app.use(cors());

app.use(express.json({ limit: "50mb" }));
connectDB();

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res
      .status(400)
      .send({ message: "Bad request. Please check your JSON format." }); // Customize the response
  }
  next(err);
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/users", usersRoutes);
app.use("/quotes", quotesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
