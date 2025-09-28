import express from "express";
import { fetchWeather } from "../controllers/mainLogic.js";

const router = express.Router();

router.use("/findClimate", fetchWeather);

export default router;
