import express from "express";
import { getCertificates } from "../controllers/certificateController.js";

const router = express.Router();

router.get("/all", getCertificates);

export default router;
