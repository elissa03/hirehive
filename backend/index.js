import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/db.js";
import { UserRouter } from "./routes/user.js";
import { AuthRouter } from "./routes/auth.js";
import { CvRouter } from "./routes/CV.js";
const app = express();
connectDB(); // Connect to Database
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }));

//routes
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/cvs/", CvRouter)


// npm run dev --to run
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
