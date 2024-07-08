import express from "express";
import { createCategory, getCategories, getCategoriesByIds } from "../controllers/categoryController.js";

const router = express.Router();

router.post(`/create`, createCategory);

router.get(`/all`,getCategories)

router.get(`/byIds`,getCategoriesByIds)

export default router;
