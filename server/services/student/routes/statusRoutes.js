import express from "express"
import { getApplicationStatus } from "../controllers/statusController.js"

const router=express.Router()

router.get('/applicationStatus',getApplicationStatus)

export default router