import express from 'express'
import { decodeUserInfo, getNewAccessToken } from '../controllers/tokenController.js'

const router=express.Router()

router.get('/accessToken/:token',getNewAccessToken)

router.get('/userInfo/:token',decodeUserInfo)

export default router