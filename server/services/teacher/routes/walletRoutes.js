import express from "express";
import {
  sentWithdrawalOTP,
  updateWithdrawalRequest,
  withdrawalRequest,
} from "../controllers/walletController.js";

const router = express.Router();

router.post("/sentOTP", sentWithdrawalOTP);

router.post("/request", withdrawalRequest);

router.put("/request", updateWithdrawalRequest);

export default router;
