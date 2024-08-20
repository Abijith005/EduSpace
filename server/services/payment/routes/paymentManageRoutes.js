import express from "express";
import { getAllPayments } from "../controllers/paymentManageController.js";

const router =express.Router()

router.get('/all',getAllPayments)

export default router
