import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Briefcase, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Briefcase className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                DrHire
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/jobs" className="text-secondary hover:text-primary transition-colors font-medium">
                            Find Jobs
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to={`/${user.role}/dashboard`}
                                    className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                {user.role === 'hospital' && (
                                    <Link
                                        to="/hospital/post-job"
                                        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Post Job
                                    </Link>
                                )}
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Admin Panel
                                    </Link>
                                )}
                                <div className="flex items-center gap-3 ml-4 border-l pl-4 border-slate-300">
                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {user.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-secondary hover:text-primary transition-colors font-medium px-4 py-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
