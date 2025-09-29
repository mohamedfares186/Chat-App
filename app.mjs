import express from "express";
const app = express();

// Dependencies
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { requestLogger } from "./src/middleware/logger.mjs";
import limiter from "./src/middleware/rateLimit.mjs";
import errorHandling from "./src/middleware/errorHandling.mjs";
import passport from "./src/config/passport.mjs";

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());

// Passport middleware
app.use(passport.initialize());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies, authorization headers, etc.
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  })
);
app.use(compression());

// Import routes
import auth from "./src/modules/Auth/routes/auth.route.mjs";
import users from "./src/modules/Users/routes/users.route.mjs";
import privateRoom from "./src/modules/Private/routes/private.route.mjs";
import group from "./src/modules/Groups/routes/group.route.mjs";

// Use routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/private", privateRoom);
app.use("/api/group", group);

// Error handling
app.use(errorHandling);

export default app;
