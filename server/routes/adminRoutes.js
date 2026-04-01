import express from 'express';
import { getHospitals, approveHospital, getStats, getUsers, getAllJobs, getPendingHospitals } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/hospitals', verifyToken, isAdmin, getHospitals);
router.get('/pending-hospitals', verifyToken, isAdmin, getPendingHospitals);
router.put('/approve/:id', verifyToken, isAdmin, approveHospital);
router.get('/stats', verifyToken, isAdmin, getStats);
router.get('/users', verifyToken, isAdmin, getUsers);
router.get('/jobs', verifyToken, isAdmin, getAllJobs);

export default router;
