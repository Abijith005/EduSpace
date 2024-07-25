import express from "express";
import { captureOrder, createOrder } from "../controllers/paypalController.js";

const router = express.Router();

router.post(`/createOrder`,createOrder)

router.post(`/executePayment`,captureOrder)

export default router;
