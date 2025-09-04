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

// Import routes
import register from "./modules/Auth/api/registerApi.mjs";
import login from "./modules/Auth/api/loginApi.mjs";
import logout from "./modules/Auth/api/logoutApi.mjs";
import email from "./modules/auth/api/emailVerifyApi.mjs";
import refresh from "./modules/auth/api/refreshApi.mjs";
import forget from "./modules/Auth/api/forgetPasswordApi.mjs";
import reset from "./modules/Auth/api/resetPasswordApi.mjs";

// Use routes
app.use("/api/auth", register);
app.use("/api/auth", login);
app.use("/api/auth", logout);
app.use("/api/auth", email);
app.use("/api/auth", refresh);
app.use("/api/auth", forget);
app.use("/api/auth", reset);

app.use(errorHandling);

export default app;
