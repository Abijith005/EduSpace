import express from "express";
import { getChatCompletion } from "../controllers/openaiControllers.js";

const router = express.Router();


router.post('/prompt',getChatCompletion)

export default router