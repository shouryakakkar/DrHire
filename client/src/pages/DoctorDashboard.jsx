import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, FileText, CheckCircle2, Clock, MapPin, Building2, UploadCloud, Briefcase } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, appsRes] = await Promise.all([
                    axios.get('/api/doctors/profile'),
                    axios.get('/api/applications/doctor')
                ]);
                setProfile(profileRes.data);
                setApplications(appsRes.data.applications || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('resume', resumeFile);

        try {
            const { data } = await axios.put('/api/doctors/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile({ ...profile, resume: data.resume });
            setMessage('Resume uploaded successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to upload resume');
        } finally {
            setUploading(false);
        }
    };

    console.log("USER:", user);
    console.log("APPLICATIONS:", applications);
    console.log("STATE:", { user, applications, loading });

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>No user data</div>;

    try {
        return (
            <div className="bg-slate-50 min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Welcome Banner */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                <User className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Welcome, Dr. {profile?.name || user?.name || "Doctor"}</h1>
                                <p className="text-slate-500 font-medium mt-1">{profile?.specialization || "Specialist"} | {profile?.experience || "0"} Yrs Exp</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile & Resume */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Resume Management
                                </h2>

                                {profile?.resume ? (
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-semibold text-green-800">Resume Uploaded</p>
                                                <a href={`http://localhost:5000${profile.resume}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline">View Document</a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center mb-4">
                                        <div className="text-sm text-amber-800">You haven't uploaded a resume yet.</div>
                                    </div>
                                )}

                                <form onSubmit={handleUpload} className="space-y-4">
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                                        <input
                                            type="file"
                                            id="resume"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setResumeFile(e.target.files[0])}
                                        />
                                        <label htmlFor="resume" className="cursor-pointer flex flex-col items-center">
                                            <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                                            <span className="text-sm font-medium text-slate-700">
                                                {resumeFile ? resumeFile.name : 'Select PDF or DOC file'}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-1">Max size 5MB</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!resumeFile || uploading}
                                        className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${!resumeFile ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-indigo-700'}`}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Resume'}
                                    </button>
                                    {message && <p className="text-sm text-center font-medium mt-2 text-primary">{message}</p>}
                                </form>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile?.skills?.length > 0 ? profile?.skills?.map((skill, i) => (
                                        <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    )) : (
                                        <p className="text-sm text-slate-500">No skills added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Applications */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between border-b pb-4">
                                    <span>My Applications</span>
                                    <span className="bg-indigo-100 text-primary text-xs px-3 py-1 rounded-full">{applications?.length || 0} Total</span>
                                </h2>

                                {applications?.length > 0 ? (
                                    <div className="space-y-4">
                                        {applications?.map((app) => (
                                            <div key={app?._id} className="border border-slate-100 p-5 rounded-xl hover:shadow-md transition-shadow group flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{app?.jobId?.title || 'Job Title'}</h3>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                        <span className="flex items-center"><Building2 className="h-4 w-4 mr-1" />{app?.jobId?.hospitalId?.hospitalName || 'Hospital'}</span>
                                                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{app?.jobId?.location || 'Location'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-1">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${app?.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                                                        {app?.status === 'Pending' ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                                                        {app?.status || 'Applied'}
                                                    </span>
                                                    <span className="text-xs text-slate-400 flex items-center mt-1">
                                                        <Clock className="h-3 w-3 mr-1" /> {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700">No Applications Yet</h3>
                                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">You haven't applied to any jobs. Explore our job board to find your next opportunity.</p>
                                        <a href="/jobs" className="mt-6 inline-block bg-primary text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Browse Jobs</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    } catch (error) {
        console.error("Dashboard render error:", error);
        return <div className="h-screen flex items-center justify-center text-red-500 font-bold">Error loading dashboard component</div>;
    }
};

export default DoctorDashboard;
