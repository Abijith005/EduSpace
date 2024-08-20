import express from "express";
import {
  getAllRequests,
  getUserRequests,
  rejectWithdrawal,
} from "../controllers/withdrawalController.js";

const router = express.Router();

router.get("/withdrawRequests", getAllRequests);

router.patch("/rejectWithdraw", rejectWithdrawal);

router.get("/userRequests", getUserRequests);

export default router;
