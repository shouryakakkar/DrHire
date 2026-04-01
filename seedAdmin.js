import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin';

dotenv.config({ path: './server/.env' });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await Admin.findOne({ email: 'admin@drhire.com' });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const admin = new Admin({
            email: 'admin@drhire.com',
            password: 'adminpassword123',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
