import express from 'express'
import { getAllCommunities, getAllMessages } from '../controllers/memberControllers.js'

const router=express.Router()


router.get(`/all`,getAllCommunities)

router.get('/messages',getAllMessages)

export default router