import express from "express";
import {
  getAllStudents,
  updateStudentStatus,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/all", getAllStudents);

router.patch("/status", updateStudentStatus);

export default router;
