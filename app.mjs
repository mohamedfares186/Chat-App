import express from "express";
const app = express();

// Dependencies
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { requestLogger } from "./middleware/logger.mjs";
import limiter from "./middleware/rateLimit.mjs";
import errorHandling from "./middleware/errorHandling.mjs";

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies, authorization headers, etc.
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  })
);

// Routes

app.use(errorHandling);

export default app;
