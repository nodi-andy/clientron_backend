import express from 'express'
import { createGoogleUser, createProfile, updateProfile, deleteProfile, getProfile, getProfilesByUser } from '../controllers/profile.js'

const router = express.Router()

router.get('/:id', getProfile)
// router.get('/', getProfiles)
router.get('/', getProfilesByUser)
router.post('/create', createProfile)
router.post('/createGoogleUser', createGoogleUser)
router.patch('/:id', updateProfile)
router.delete('/:id', deleteProfile)


export default router