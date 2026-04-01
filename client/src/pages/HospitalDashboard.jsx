import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Building2, PlusCircle, Users, Activity, CheckCircle, Clock, Briefcase, Trash2, XCircle } from 'lucide-react';

const HospitalDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ activeJobsCount: 0, totalApplicants: 0, profileViews: 0 });
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // New Job Form State
    const [isPosting, setIsPosting] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', specialization: '', experienceRequired: '', salaryRange: '', location: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/hospitals/stats');
                setProfile(data.profile);
                setStats(data.stats);
                setJobs(data.jobs || []);
            } catch (error) {
                console.error('Error fetching hospital data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                experienceRequired: Number(formData.experienceRequired),
            };
            const { data } = await axios.post('/api/jobs', payload);
            setJobs([...jobs, { ...data, applicants: [] }]);
            setIsPosting(false);
            setFormData({ title: '', description: '', specialization: '', experienceRequired: '', salaryRange: '', location: '' });
        } catch (error) {
            alert('Failed to post job: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) return;
        try {
            await axios.delete(`/api/jobs/${id}`);
            setJobs(jobs.filter(job => job._id !== id));
        } catch (error) {
            alert('Failed to delete job: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;

    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{profile?.hospitalName}</h1>
                                <div className="flex items-center mt-1 text-sm">
                                    {profile?.status === 'approved' ? (
                                        <span className="flex items-center text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-md">
                                            <CheckCircle className="h-4 w-4 mr-1" /> Verified Institution
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md">
                                            <Clock className="h-4 w-4 mr-1" /> Pending Verification
                                        </span>
                                    )}
                                    <span className="mx-3 text-slate-300">|</span>
                                    <span className="text-slate-500">{profile?.location}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPosting(!isPosting)}
                            className="bg-primary hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            {isPosting ? 'Cancel' : 'Post New Job'}
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                        <div className="bg-indigo-50 p-4 rounded-full mr-4"><Briefcase className="h-6 w-6 text-primary" /></div>
                        <div><p className="text-sm text-slate-500 font-medium">Active Jobs</p><p className="text-2xl font-bold text-slate-900">{stats.activeJobsCount}</p></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                        <div className="bg-emerald-50 p-4 rounded-full mr-4"><Users className="h-6 w-6 text-emerald-600" /></div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Applicants</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.totalApplicants}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                        <div className="bg-blue-50 p-4 rounded-full mr-4"><Activity className="h-6 w-6 text-blue-600" /></div>
                        <div><p className="text-sm text-slate-500 font-medium">Profile Views</p><p className="text-2xl font-bold text-slate-900">{stats.profileViews}</p></div>
                    </div>
                </div>

                {/* Post Job Form */}
                {isPosting && (
                    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-8 mb-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4">Create Job Posting</h2>
                        {profile?.status === 'pending' && (
                            <div className="bg-red-50 text-red-600 p-6 rounded-lg mb-6 shadow-sm border border-red-200">
                                <h3 className="text-lg font-bold mb-1 flex items-center"><Clock className="h-5 w-5 mr-2" />Verification Pending</h3>
                                <p className="font-medium">Your account is currently under verification by the Admin. Please try again later.</p>
                            </div>
                        )}
                        {profile?.status === 'rejected' && (
                            <div className="bg-rose-50 text-rose-600 p-6 rounded-lg mb-6 shadow-sm border border-rose-200">
                                <h3 className="text-lg font-bold mb-1 flex items-center"><XCircle className="h-5 w-5 mr-2" />Verification Rejected</h3>
                                <p className="font-medium">Your account verification was rejected. Please contact support.</p>
                            </div>
                        )}
                        <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                <input required type="text" disabled={profile?.status !== 'approved'} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Senior Cardiologist" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
                                <textarea required rows="4" disabled={profile?.status !== 'approved'} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400 whitespace-pre-wrap" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed role description..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                                <input required type="text" disabled={profile?.status !== 'approved'} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} placeholder="e.g. Cardiology" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <input required type="text" disabled={profile?.status !== 'approved'} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. New York, NY" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience Required</label>
                                <input required type="number" disabled={profile?.status !== 'approved'} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400" value={formData.experienceRequired} onChange={e => setFormData({ ...formData, experienceRequired: e.target.value })} placeholder="5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range (Optional)</label>
                                <input type="text" disabled={profile?.status !== 'approved'} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400" value={formData.salaryRange} onChange={e => setFormData({ ...formData, salaryRange: e.target.value })} placeholder="e.g. $200k - $300k" />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" disabled={profile?.status !== 'approved'} className={`px-8 py-3 rounded-lg font-bold transition-colors ${profile?.status !== 'approved' ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-primary hover:bg-indigo-700 text-white'}`}>
                                    Publish Job
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Jobs List & Applicants */}
                <h2 className="text-xl font-bold text-slate-900 mb-6">Manage Posted Jobs</h2>
                <div className="space-y-6">
                    {jobs.length > 0 ? jobs.map(job => (
                        <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                                    <div className="text-sm text-slate-500 mt-1 flex flex-wrap gap-2 md:gap-4 items-center">
                                        <span>{job.specialization}</span>
                                        <span className="hidden md:inline">•</span>
                                        <span>{job.location}</span>
                                        <span className="hidden md:inline">•</span>
                                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-100 text-primary font-bold px-4 py-2 rounded-lg">
                                        {job.applicants?.length || 0} Applicants
                                    </div>
                                    <button
                                        onClick={() => handleDeleteJob(job._id)}
                                        className="text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm flex items-center border border-rose-100"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {job.applicants && job.applicants.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {job.applicants.map(applicant => (
                                            <div key={applicant._id} className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-3 mb-3 border-b border-slate-50 pb-3">
                                                    <div className="bg-slate-100 h-10 w-10 text-slate-600 rounded-full flex items-center justify-center font-bold">
                                                        {applicant.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{applicant.name}</p>
                                                        <p className="text-xs text-slate-500">{applicant.specialization} • {applicant.experience} yrs exp</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <a href={`mailto:${applicant.email}`} className="text-sm text-primary hover:underline">Contact</a>
                                                    {applicant.resume && (
                                                        <a href={`http://localhost:5000${applicant.resume}`} target="_blank" rel="noreferrer" className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded transition-colors">
                                                            View CV
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm py-4 text-center italic">No applicants yet for this position.</p>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900">No Jobs Posted</h3>
                            <p className="text-slate-500 mt-1">You haven't posted any open positions yet.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HospitalDashboard;
