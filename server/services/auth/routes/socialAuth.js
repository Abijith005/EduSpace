import express from "express";
import { userSocialLogin } from "../controllers/socialAuthController.js";

const router = express.Router();

router.post('/login',userSocialLogin)


export default router;
