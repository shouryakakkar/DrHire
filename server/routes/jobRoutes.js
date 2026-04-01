import express from 'express';
import {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
} from '../controllers/jobController.js';
import { verifyToken, isHospital, checkHospitalVerification } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(verifyToken, isHospital, checkHospitalVerification, createJob);

router.route('/:id')
    .get(getJobById)
    .put(verifyToken, isHospital, updateJob)
    .delete(verifyToken, isHospital, deleteJob);

export default router;
