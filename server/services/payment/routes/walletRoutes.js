import express from "express";
import { getBalance,walletPayout} from "../controllers/walletController.js";

const router = express.Router();

router.get('/balance/:userId',getBalance)

router.post('/payout',walletPayout)

export default router;
