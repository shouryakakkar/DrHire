import express from 'express';
import { getDoctorProfile, updateDoctorProfile } from '../controllers/doctorController.js';
import { verifyToken, isDoctor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, isDoctor, getDoctorProfile);
router.put('/update', verifyToken, isDoctor, upload.single('resume'), updateDoctorProfile);

export default router;
