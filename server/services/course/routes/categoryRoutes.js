import express from "express";
import { createCategory, getCategories, updateCategoryStatus } from "../controllers/categoryController.js";

const router = express.Router();

router.post(`/create`, createCategory);

router.get(`/all`,getCategories)

router.patch('/updateStatus',updateCategoryStatus)


export default router;
