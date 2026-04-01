import { MapPin, Briefcase, Clock, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 p-6 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                        <Building className="h-4 w-4" />
                        {job.hospitalId?.hospitalName || 'Top Hospital'}
                    </p>
                </div>
                <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {job.specialization}
                </span>
            </div>

            <div className="space-y-2 mb-6 flex-grow">
                <div className="flex items-center text-slate-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {job.location}
                </div>
                <div className="flex items-center text-slate-600 text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
                    {job.experienceRequired} + years experience
                </div>
                <div className="flex items-center text-slate-600 text-sm">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    Full-time
                </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                <span className="text-primary font-semibold">
                    {job.salaryRange || 'Competitive'}
                </span>
                <Link
                    to={`/jobs/${job._id}`}
                    className="text-white bg-slate-900 hover:bg-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
