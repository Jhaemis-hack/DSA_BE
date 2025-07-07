// api/index.ts
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import errorHandler from "../utils/errorHandler";
import authRoutes from "../modules/Auth/auth.routes";
import menteeRoutes from "../modules/Mentee/mentee.routes";
import mentorRoutes from "../modules/Mentor/mentor.routes";
import adminRoutes from "../modules/Admin/admin.routes";
import DB from "../config/db";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Server is up and running. Use /api/v1/*** to consume this API.");
});

app.get("/api/v1", (_req, res) => {
  res.send("Welcome to the DSA Project API");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", menteeRoutes);
app.use("/api/v1/mentors", mentorRoutes);
app.use("/api/v1/admin", adminRoutes);

// Catch-all 404 for API
app.all("*", (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({
      status_code: StatusCodes.NOT_FOUND,
      message: `Cannot ${req.method} ${req.url}`,
      data: null,
    });
});

app.use(errorHandler);

// Make sure DB is connected on cold start
DB();

// **Export the app as a Vercel Serverless Function handler**
export default app;
