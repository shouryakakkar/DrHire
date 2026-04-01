import Hospital from '../models/Hospital.js';
import Doctor from '../models/Doctor.js';
import Job from '../models/Job.js';

// @desc    Get all hospitals
// @route   GET /api/admin/hospitals
// @access  Private (Admin)
export const getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find({}).select('-password');
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending hospitals
// @route   GET /api/admin/pending-hospitals
// @access  Private (Admin)
export const getPendingHospitals = async (req, res) => {
    try {
        const pending = await Hospital.find({ status: 'pending' }).select('-password');
        res.json({ hospitals: pending });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a hospital
// @route   PUT /api/admin/approve/:id
// @access  Private (Admin)
export const approveHospital = async (req, res) => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );

        if (updatedHospital) {
            res.status(200).json(updatedHospital);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getStats = async (req, res) => {
    try {
        const doctorsCount = await Doctor.countDocuments();
        const hospitalsCount = await Hospital.countDocuments();
        const pendingHospitalsCount = await Hospital.countDocuments({ status: 'pending' });
        const jobsCount = await Job.countDocuments();

        res.json({
            doctors: doctorsCount,
            hospitals: hospitalsCount,
            jobs: jobsCount,
            pendingHospitals: pendingHospitalsCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (doctors)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
    try {
        const users = await Doctor.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}).populate('hospitalId', 'hospitalName location');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
