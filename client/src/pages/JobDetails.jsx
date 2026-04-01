import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Briefcase, DollarSign, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applyMessage, setApplyMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(`/api/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error('Failed to fetch job', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            setApplyMessage({ text: 'Please login to apply', type: 'error' });
            return;
        }
        setApplying(true);
        try {
            await axios.post(`/api/apply/${id}`);
            setApplyMessage({ text: 'Successfully applied!', type: 'success' });
            // Update local state to instantly reflect the apply action
            setJob(prev => ({
                ...prev,
                applicants: [...(prev.applicants || []), user._id]
            }));
        } catch (error) {
            setApplyMessage({
                text: error.response?.data?.message || 'Failed to apply',
                type: 'error'
            });
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return <div className="h-screen flex justify-center items-center"><div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full"></div></div>;
    }

    if (!job) {
        return <div className="p-8 text-center text-slate-500">Job not found</div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/jobs" className="flex items-center text-slate-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to jobs
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-900 border-b border-slate-200 p-8 sm:p-10 text-white relative">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                            <div>
                                <span className="bg-white/20 text-indigo-50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
                                    {job.specialization}
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-6 text-indigo-100">
                                    <div className="flex items-center">
                                        <Building2 className="h-5 w-5 mr-2" />
                                        {job.hospitalId?.hospitalName}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 mr-2" />
                                        {job.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Background design */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
                    </div>

                    <div className="p-8 sm:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 border-b pb-2 mb-4">Job Description</h2>
                                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {job.description}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 border-b pb-2 mb-4">Hospital Information</h2>
                                    <div className="text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <h3 className="font-semibold text-slate-800 mb-2">{job.hospitalId?.hospitalName}</h3>
                                        <p>{job.hospitalId?.description || 'A top-rated healthcare institution dedicated to providing excellent patient care and advancing medical research.'}</p>
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                                    <h3 className="font-semibold text-slate-900 mb-2">Job Overview</h3>

                                    <div className="flex items-start">
                                        <Briefcase className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Experience</p>
                                            <p className="text-sm text-slate-500">{job.experienceRequired}+ years required</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <DollarSign className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Salary Range</p>
                                            <p className="text-sm text-slate-500">{job.salaryRange || 'Competitive Based on Experience'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Clock className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Posted on</p>
                                            <p className="text-sm text-slate-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    {user?.role === 'doctor' ? (
                                        <div className="space-y-4">
                                            {job?.applicants?.some(a => a === user._id || a._id === user._id) ? (
                                                <button disabled className="w-full py-4 px-6 rounded-xl font-bold text-green-700 bg-green-50 shadow-sm transition-all flex items-center justify-center">
                                                    <CheckCircle className="h-5 w-5 mr-2" /> Already Applied
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleApply}
                                                    disabled={applying}
                                                    className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all ${applying ? 'bg-indigo-400' : 'bg-primary hover:bg-indigo-700 hover:-translate-y-1'}`}
                                                >
                                                    {applying ? 'Applying...' : 'Apply for this position'}
                                                </button>
                                            )}
                                            {applyMessage.text && (
                                                <div className={`p-4 rounded-lg flex items-center ${applyMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {applyMessage.type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
                                                    {applyMessage.text}
                                                </div>
                                            )}
                                        </div>
                                    ) : user?.role === 'hospital' ? (
                                        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 text-sm">
                                            You are logged in as a hospital. Only doctors can apply to jobs.
                                        </div>
                                    ) : (
                                        <Link to="/login" className="block w-full text-center bg-primary hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors">
                                            Log in to apply
                                        </Link>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
