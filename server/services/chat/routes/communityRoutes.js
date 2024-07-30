import express from 'express'
import { getAllCommunities } from '../controllers/memberControllers.js'

const router=express.Router()


router.get(`/all`,getAllCommunities)

export default router