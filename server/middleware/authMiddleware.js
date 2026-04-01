import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';
import Admin from '../models/Admin.js';

const verifyToken = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.userRole = decoded.role;
            if (decoded.role === 'doctor') {
                req.user = await Doctor.findById(decoded.id).select('-password');
            } else if (decoded.role === 'hospital') {
                req.user = await Hospital.findById(decoded.id).select('-password');
            } else if (decoded.role === 'admin') {
                req.user = await Admin.findById(decoded.id).select('-password');
            }

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.userRole === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const isHospital = (req, res, next) => {
    if (req.user && req.userRole === 'hospital') {
        next();
    } else {
        return res.status(403).json({ message: 'Not authorized as a hospital' });
    }
};

const isDoctor = (req, res, next) => {
    if (req.user && req.userRole === 'doctor') {
        next();
    } else {
        return res.status(403).json({ message: 'Not authorized as a doctor' });
    }
};

const checkHospitalVerification = async (req, res, next) => {
    try {
        if (req.user && req.userRole === 'hospital') {
            const hospital = await Hospital.findById(req.user.id);
            if (hospital && hospital.status === 'approved') {
                next();
            } else {
                res.status(403).json({ message: "Your account is under verification. You cannot post jobs yet." });
            }
        } else {
            res.status(401).json({ message: "Not authorized as a hospital." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { verifyToken, isAdmin, isHospital, isDoctor, checkHospitalVerification };
