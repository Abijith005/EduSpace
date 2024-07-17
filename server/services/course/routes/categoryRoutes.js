import express from "express";
import { createCategory, getAllowedCategories, getCategories, getCoursePerCategory, updateCategoryStatus } from "../controllers/categoryController.js";

const router = express.Router();

router.post(`/create`, createCategory);

router.get(`/all`,getCategories)

router.patch('/updateStatus',updateCategoryStatus)

router.get(`/allowed`,getAllowedCategories)

router.get(`/courseCount`,getCoursePerCategory)


export default router;
