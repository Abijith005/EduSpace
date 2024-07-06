import express from "express";
import { createCategory, getAllCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.post(`/create`, createCategory);

router.get(`/all`,getAllCategories)

router.get(`/byIds`,)

export default router;
