import express from 'express'
import { getNewAccessToken } from '../controllers/tokenController.js'

const router=express.Router()

router.get('/accessToken/:token',getNewAccessToken)

export default router