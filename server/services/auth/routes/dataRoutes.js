import express from "express"
import { getUsers } from "../controllers/dataController.js"

const router=express.Router()

router.get('/byIds',getUsers)

export default router