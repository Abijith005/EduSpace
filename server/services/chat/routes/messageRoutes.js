import express from "express";
import { getAllMessages, updateMessageRead } from "../controllers/messageController.js";

const router = express.Router();

router.get("/all", getAllMessages);

router.patch("/messageRead",updateMessageRead);

export default router;
