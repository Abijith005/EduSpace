import express from 'express'
import { forgotPassword, forgotPasswordverifyOtp, updatePassword, userLogin, userRegister, userRegistrationOtp,  } from '../controllers/userAuthController.js'

const router=express.Router()

router.post('/register',userRegister)

router.post('/login',userLogin)

router.post('/sendOtp',userRegistrationOtp)

router.post('/forgotPassword',forgotPassword)

router.post('/verifyOtp',forgotPasswordverifyOtp)

router.patch('/updatePassword',updatePassword)


export default router