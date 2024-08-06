import express from "express";
import {  userSocialSignIn, userSocialSignup } from "../controllers/socialAuthController.js";

const router = express.Router();

router.post('/register',userSocialSignup)

router.post('/login',userSocialSignIn)



export default router;
