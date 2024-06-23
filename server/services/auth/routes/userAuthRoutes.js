import express from 'express'
import { frogotPassword, updatePassword, userLogin, userRegister, userRegistrationOtp, verifyOtp } from '../controllers/userAuthController.js'

const router=express.Router()

router.post('/register',userRegister)

router.post('/login',userLogin)

router.post('/sendOtp',userRegistrationOtp)

router.post('/forgotPassword',frogotPassword)

router.post('/verifyOtp',verifyOtp)

router.patch('/updatePassword',updatePassword)


export default router