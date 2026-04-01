import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';
import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new doctor
// @route   POST /api/auth/register/doctor
// @access  Public
export const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, licenseNumber, skills } = req.body;

        const doctorExists = await Doctor.findOne({ email });
        if (doctorExists) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }

        const doctor = await Doctor.create({
            name,
            email,
            password,
            specialization,
            experience,
            licenseNumber,
            skills: skills || [],
        });

        if (doctor) {
            generateToken(res, doctor._id, 'doctor');
            res.status(201).json({
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                role: 'doctor',
            });
        } else {
            res.status(400).json({ message: 'Invalid doctor data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new hospital
// @route   POST /api/auth/register/hospital
// @access  Public
export const registerHospital = async (req, res) => {
    try {
        const { hospitalName, email, password, location, description } = req.body;

        const hospitalExists = await Hospital.findOne({ email });
        if (hospitalExists) {
            return res.status(400).json({ message: 'Hospital already exists' });
        }

        const hospital = await Hospital.create({
            hospitalName,
            email,
            password,
            location,
            description,
        });

        if (hospital) {
            generateToken(res, hospital._id, 'hospital');
            res.status(201).json({
                _id: hospital._id,
                hospitalName: hospital.hospitalName,
                email: hospital.email,
                role: 'hospital',
            });
        } else {
            res.status(400).json({ message: 'Invalid hospital data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check Admin first
        let user = await Admin.findOne({ email });
        let role = 'admin';

        // If not admin, check Doctor
        if (!user) {
            user = await Doctor.findOne({ email });
            role = 'doctor';
        }

        // If not doctor, check Hospital
        if (!user) {
            user = await Hospital.findOne({ email });
            role = 'hospital';
        }

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id, role);
            res.json({
                _id: user._id,
                email: user.email,
                name: user.name || user.hospitalName || 'Admin',
                role,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile based on cookie
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = req.user;
        if (user) {
            res.json({
                _id: user._id,
                email: user.email,
                name: user.name || user.hospitalName || 'Admin',
                role: req.userRole,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
