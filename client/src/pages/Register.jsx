import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Building2, Stethoscope } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('doctor'); // 'doctor' or 'hospital'
    const [formData, setFormData] = useState({
        name: '',
        hospitalName: '',
        email: '',
        password: '',
        specialization: '',
        experience: '',
        licenseNumber: '',
        location: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { registerDoctor, registerHospital, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        else if (user.role === 'hospital') return <Navigate to="/hospital/dashboard" replace />;
        else return <Navigate to="/doctor/dashboard" replace />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (role === 'doctor') {
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    specialization: formData.specialization,
                    experience: Number(formData.experience),
                    licenseNumber: formData.licenseNumber,
                };
                await registerDoctor(payload);
                navigate('/doctor/dashboard');
            } else {
                const payload = {
                    hospitalName: formData.hospitalName,
                    email: formData.email,
                    password: formData.password,
                    location: formData.location,
                };
                await registerHospital(payload);
                navigate('/hospital/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || `Failed to register ${role}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl z-10 border border-slate-100">
                <div className="text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-primary" />
                    <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Join DrHire to find your next opportunity or hire top talent.
                    </p>
                </div>

                {/* Role Selection */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setRole('doctor')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'doctor' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Stethoscope className="w-4 h-4 inline mr-2" />
                        I'm a Doctor
                    </button>
                    <button
                        onClick={() => setRole('hospital')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'hospital' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Building2 className="w-4 h-4 inline mr-2" />
                        I'm a Hospital
                    </button>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

                    {role === 'doctor' ? (
                        <>
                            <div>
                                <input name="name" type="text" required placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <input name="email" type="email" required placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <input name="password" type="password" required placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <input name="specialization" type="text" required placeholder="Specialization (e.g. Cardiologist)" value={formData.specialization} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div className="flex gap-4">
                                <input name="experience" type="number" required placeholder="Years of Exp." value={formData.experience} onChange={handleChange} className="w-1/2 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                                <input name="licenseNumber" type="text" required placeholder="License No." value={formData.licenseNumber} onChange={handleChange} className="w-1/2 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <input name="hospitalName" type="text" required placeholder="Hospital / Organization Name" value={formData.hospitalName} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <input name="email" type="email" required placeholder="Organization Email Address" value={formData.email} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <input name="password" type="password" required placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <input name="location" type="text" required placeholder="Location / Address" value={formData.location} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 flex justify-center text-sm font-medium rounded-lg text-white ${isLoading ? 'bg-indigo-400' : 'bg-primary hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
                    >
                        {isLoading ? 'Creating account...' : `Register as ${role === 'doctor' ? 'Doctor' : 'Hospital'}`}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
