import cookieParser from "cookie-parser";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mainLogicRoutes from "./routes/mainLogicRoute.js";

dotenv.config();

import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(errorHandler);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    Credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  delayAfter: 15,
  delayMs: 5 * 60 * 1000,
});
app.use(limiter);

//routes
app.use("/api/shop", mainLogicRoutes);
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "NO route found",
  });
});

export default app;
