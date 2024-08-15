import express from "express";
import { addReview, getReview } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/add", addReview);

router.get("/all", getReview);

export default router;
