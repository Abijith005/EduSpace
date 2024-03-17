import express from 'express'
import { userLogin, userRegister, userRegistrationOtp } from '../controllers/userAuthController.js'

const router=express.Router()

router.post('/register',userRegister)

router.post('/login',userLogin)

router.post('/sendOtp',userRegistrationOtp)


export default router