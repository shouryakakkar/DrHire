import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';
import Hospital from './models/Hospital.js';
import Job from './models/Job.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");
        const doctors = await Doctor.find().populate({
            path: 'appliedJobs',
            populate: { path: 'hospitalId', select: 'hospitalName location' }
        });

        console.log("Doctors mapping:");
        for (let doc of doctors) {
            console.log(`Doctor: ${doc.name} (${doc.email}) - Applied Jobs: ${doc.appliedJobs.length}`);
            if (doc.appliedJobs.length > 0) {
                console.log(JSON.stringify(doc.appliedJobs, null, 2));
            }
        }
        process.exit(0);
    })
    .catch(console.error);
