import express from "express";
import uploadFiles from "../multerMiddlewares/uploadFiles.js";
import {
  getAllCourseStats,
  getAllCourses,
  getCourseDetails,
  getFeaturedCourse,
  updateCourse,
  uploadCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post(`/uploadCourse`, uploadFiles, uploadCourse);
 
router.get(`/all`, getAllCourses);

router.put(`/updateCourse/:course_id`, uploadFiles, updateCourse);

router.get(`/filterDatas`, getAllCourseStats);

router.get(`/courseDetails/:courseId`,getCourseDetails);

router.get(`/featured`,getFeaturedCourse);


export default router;
