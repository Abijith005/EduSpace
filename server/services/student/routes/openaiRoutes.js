import express from "express";
import { getChatCompletion } from "../controllers/openaiControllers.js";

const router = express.Router();


router.post('/qestion',getChatCompletion)

export default router