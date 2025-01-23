import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { useExpressServer } from "routing-controllers";
import { CustomErrorHandler } from "./global/middlewares";
import { UserController, UserUtility } from "./user";
import { PackageController } from "./package";
import { ReviewController } from "./review";
import { MessageController } from "./message";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./global/configurations/db.config";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB().then((r) => console.log("Connected to MongoDB"));
//@ts-ignore
const port = parseInt(process.env.PORT);
let app: Express = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

useExpressServer(app, {
  controllers: [
    MessageController,
    UserController,
    PackageController,
    ReviewController,
  ],
  middlewares: [CustomErrorHandler],
  defaultErrorHandler: false,
  authorizationChecker: new UserUtility().authorizationChecker,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
