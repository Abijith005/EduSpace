import express from "express";
import { getAllTeachers, updateTeacherStatus } from "../controllers/teacherController.js";

const router = express.Router();

router.get(`/all`, getAllTeachers);

router.patch("/status", updateTeacherStatus);

export default router;
