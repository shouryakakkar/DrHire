import express from 'express';
import { applyToJob } from '../controllers/jobController.js';
import { verifyToken, isDoctor } from '../middleware/authMiddleware.js';
import Doctor from '../models/Doctor.js';
import Job from '../models/Job.js';

const router = express.Router();

// router.post('/:jobId') handled further down

// Get applications
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.userRole === 'doctor') {
            const userId = req.user.id || req.user._id;
            const doctor = await Doctor.findById(userId).populate({
                path: 'appliedJobs',
                populate: { path: 'hospitalId', select: 'hospitalName' }
            });
            res.json({ applications: doctor.appliedJobs || [] });
        } else if (req.userRole === 'hospital') {
            const jobs = await Job.find({ hospitalId: req.user._id })
                .populate('applicants', 'name email specialization experience resume');
            res.json({ applications: jobs });
        } else {
            res.status(403).json({ message: 'Not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/applications/doctor
router.get('/doctor', verifyToken, isDoctor, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const doctor = await Doctor.findById(userId).populate({
            path: 'appliedJobs',
            populate: { path: 'hospitalId', select: 'hospitalName location' }
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Filter out null jobs (deleted jobs)
        const validJobs = doctor.appliedJobs.filter(job => job != null);

        // Map the array into objects that resemble an Application collection response
        const appsWithStatus = validJobs.map(job => {
            return {
                _id: job._id.toString() + "_app", // Pseudo ID
                jobId: job, // This passes the full populated job object
                status: 'Pending', // Default status
                createdAt: job.createdAt || new Date()
            };
        });

        res.json({ applications: appsWithStatus });
    } catch (error) {
        console.error("Error fetching doctor applications:", error);
        res.status(500).json({ message: error.message });
    }
});

// Apply to a job
router.post('/:jobId', verifyToken, isDoctor, applyToJob);

export default router;
