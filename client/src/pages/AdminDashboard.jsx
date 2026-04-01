import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Activity, Users, Building2, Briefcase, CheckCircle2, XCircle, Clock, LayoutDashboard, FileCheck } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ doctors: 0, hospitals: 0, jobs: 0 });
    const [hospitals, setHospitals] = useState([]);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [pendingHospitalsState, setPendingHospitalsState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, hospitalsRes, usersRes, jobsRes, pendingRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/admin/hospitals'),
                    axios.get('/api/admin/users'),
                    axios.get('/api/admin/jobs'),
                    axios.get('/api/admin/pending-hospitals'),
                ]);
                setStats(statsRes.data);
                setHospitals(hospitalsRes.data);
                setUsers(usersRes.data);
                setJobs(jobsRes.data);
                setPendingHospitalsState(pendingRes.data.hospitals || []);
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleApprove = async (id) => {
        try {
            const { data } = await axios.put(`http://localhost:5000/api/admin/approve/${id}`);

            // Remove from pending
            setPendingHospitalsState(prev => prev.filter(h => h._id !== id));

            // Add or update in verified hospitals list
            setHospitals(prev => {
                const exists = prev.find(h => h._id === id);
                if (exists) {
                    return prev.map(h => h._id === id ? data : h);
                } else {
                    return [...prev, data];
                }
            });

            alert('Hospital approved successfully');
        } catch (error) {
            alert('Failed to approve hospital');
        }
    };

    console.log("ADMIN:", user);
    console.log("USERS:", users);
    console.log("HOSPITALS:", hospitals);
    console.log("JOBS:", jobs);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;
    if (!user) return <div>No admin data</div>;
    if (user?.role !== "admin") {
        return <Navigate to="/" />;
    }

    try {
        const pendingHospitals = pendingHospitalsState;
        const verifiedHospitals = (hospitals || []).filter(h => h.status === 'approved');

        const renderSidebarItem = (id, icon, label, badgeCount) => (
            <button
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === id
                    ? 'bg-primary text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
            >
                {icon}
                <span>{label}</span>
                {badgeCount > 0 && (
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === id ? 'bg-white text-primary' : 'bg-rose-100 text-rose-600'
                        }`}>
                        {badgeCount}
                    </span>
                )}
            </button>
        );

        return (
            <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 overflow-y-auto hidden md:flex">
                    <div className="flex items-center gap-3 mb-6 px-4">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        <h2 className="text-xl font-bold text-slate-900">Admin</h2>
                    </div>
                    {renderSidebarItem('overview', <LayoutDashboard className="h-5 w-5" />, 'Overview')}
                    {renderSidebarItem('approvals', <FileCheck className="h-5 w-5" />, 'Approvals', pendingHospitals.length)}
                    {renderSidebarItem('hospitals', <Building2 className="h-5 w-5" />, 'Hospitals')}
                    {renderSidebarItem('doctors', <Users className="h-5 w-5" />, 'Doctors')}
                    {renderSidebarItem('jobs', <Briefcase className="h-5 w-5" />, 'Jobs')}
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {/* Mobile tabs */}
                    <div className="flex md:hidden overflow-x-auto gap-2 mb-6 pb-2">
                        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Overview</button>
                        <button onClick={() => setActiveTab('approvals')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${activeTab === 'approvals' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Approvals ({pendingHospitals.length})</button>
                        <button onClick={() => setActiveTab('hospitals')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${activeTab === 'hospitals' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Hospitals</button>
                        <button onClick={() => setActiveTab('doctors')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${activeTab === 'doctors' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Doctors</button>
                        <button onClick={() => setActiveTab('jobs')} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${activeTab === 'jobs' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Jobs</button>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="animate-fade-in">
                            <h1 className="text-2xl font-bold text-slate-900 mb-8">Platform Overview</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                                    <div className="bg-rose-50 p-4 rounded-full mr-4"><FileCheck className="h-6 w-6 text-rose-600" /></div>
                                    <div><p className="text-sm text-slate-500 font-medium">Pending Approvals</p><p className="text-2xl font-bold text-slate-900">{pendingHospitals.length}</p></div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                                    <div className="bg-emerald-50 p-4 rounded-full mr-4"><Users className="h-6 w-6 text-emerald-600" /></div>
                                    <div><p className="text-sm text-slate-500 font-medium">Total Doctors</p><p className="text-2xl font-bold text-slate-900">{users?.length || 0}</p></div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                                    <div className="bg-blue-50 p-4 rounded-full mr-4"><Building2 className="h-6 w-6 text-blue-600" /></div>
                                    <div><p className="text-sm text-slate-500 font-medium">Verified Hospitals</p><p className="text-2xl font-bold text-slate-900">{verifiedHospitals.length}</p></div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                                    <div className="bg-amber-50 p-4 rounded-full mr-4"><Briefcase className="h-6 w-6 text-amber-600" /></div>
                                    <div><p className="text-sm text-slate-500 font-medium">Jobs Posted</p><p className="text-2xl font-bold text-slate-900">{jobs?.length || 0}</p></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'approvals' && (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Hospital Approvals</h1>
                                    <p className="text-sm text-slate-500 mt-1">Review and approve hospital accounts.</p>
                                </div>
                                <span className="bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-full text-sm">{pendingHospitals.length} Pending</span>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr className="text-slate-500 text-sm font-semibold whitespace-nowrap">
                                                <th className="py-4 px-6">Hospital Name</th>
                                                <th className="py-4 px-6">Email</th>
                                                <th className="py-4 px-6">Location</th>
                                                <th className="py-4 px-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {pendingHospitals.map(hospital => (
                                                <tr key={hospital._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">{hospital.hospitalName}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{hospital.email}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{hospital.location}</td>
                                                    <td className="py-4 px-6 text-right whitespace-nowrap">
                                                        <button onClick={() => handleApprove(hospital._id)} className="text-white bg-primary hover:bg-indigo-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                                                            Approve
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pendingHospitals.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-12 text-slate-500">No pending approvals.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hospitals' && (
                        <div className="animate-fade-in">
                            <h1 className="text-2xl font-bold text-slate-900 mb-8">Verified Hospitals</h1>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr className="text-slate-500 text-sm font-semibold whitespace-nowrap">
                                                <th className="py-4 px-6">Hospital Name</th>
                                                <th className="py-4 px-6">Email</th>
                                                <th className="py-4 px-6">Location</th>
                                                <th className="py-4 px-6">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {verifiedHospitals.map(hospital => (
                                                <tr key={hospital._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">{hospital.hospitalName}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{hospital.email}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{hospital.location}</td>
                                                    <td className="py-4 px-6 whitespace-nowrap">
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {verifiedHospitals.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-12 text-slate-500">No verified hospitals yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'doctors' && (
                        <div className="animate-fade-in">
                            <h1 className="text-2xl font-bold text-slate-900 mb-8">Registered Doctors</h1>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr className="text-slate-500 text-sm font-semibold whitespace-nowrap">
                                                <th className="py-4 px-6">Doctor Name</th>
                                                <th className="py-4 px-6">Email</th>
                                                <th className="py-4 px-6">Specialization</th>
                                                <th className="py-4 px-6">Experience</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {(users || []).map(doctor => (
                                                <tr key={doctor._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">{doctor.name}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{doctor.email}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{doctor.specialization}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{doctor.experience} Yrs</td>
                                                </tr>
                                            ))}
                                            {(!users || users.length === 0) && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-12 text-slate-500">No doctors registered yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'jobs' && (
                        <div className="animate-fade-in">
                            <h1 className="text-2xl font-bold text-slate-900 mb-8">All Jobs Posted</h1>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr className="text-slate-500 text-sm font-semibold whitespace-nowrap">
                                                <th className="py-4 px-6">Job Title</th>
                                                <th className="py-4 px-6">Hospital</th>
                                                <th className="py-4 px-6">Location</th>
                                                <th className="py-4 px-6">Applicants</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {(jobs || []).map(job => (
                                                <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">{job.title}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{job.hospitalId?.hospitalName || 'Unknown'}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{job.location}</td>
                                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                                                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                                                            {job.applicants?.length || 0}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!jobs || jobs.length === 0) && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-12 text-slate-500">No jobs posted yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div>Error loading admin dashboard</div>;
    }
};

export default AdminDashboard;
