import express from "express";
import { getRequests } from "../controllers/teacherRequestsController.js";

const router = express.Router();

router.get("/all", getRequests);

export default router;
