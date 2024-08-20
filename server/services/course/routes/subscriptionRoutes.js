import express from "express";
import {
  getAllSubscriptions,
  isSubscribed,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/all", getAllSubscriptions);

router.get("/isSubscribed/:courseId", isSubscribed);

export default router;
