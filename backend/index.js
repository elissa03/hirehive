import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/db.js";

const app = express();

connectDB(); // Connect to Database

const port = process.env.PORT;

// npm run dev --to run
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
