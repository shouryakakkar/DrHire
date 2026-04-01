import express from 'express';
import { getHospitalProfile, updateHospitalProfile, getDashboardStats } from '../controllers/hospitalController.js';
import { verifyToken, isHospital } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, isHospital, getHospitalProfile);
router.get('/stats', verifyToken, isHospital, getDashboardStats);
router.put('/update', verifyToken, isHospital, updateHospitalProfile);

export default router;
