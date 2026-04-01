import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-4">DrHire</h2>
                        <p className="text-slate-400 mb-6 max-w-sm">
                            Connecting brilliant healthcare professionals with leading medical institutions worldwide. Your career in medicine starts here.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">For Doctors</h3>
                        <ul className="space-y-2">
                            <li><a href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</a></li>
                            <li><a href="/register" className="hover:text-primary transition-colors">Create Profile</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Career Resources</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">For Hospitals</h3>
                        <ul className="space-y-2">
                            <li><a href="/register" className="hover:text-primary transition-colors">Post a Job</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing Solutions</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} DrHire Platform. All rights reserved.
                    </p>
                    <p className="text-sm flex items-center mt-4 md:mt-0">
                        Made with <Heart className="h-4 w-4 text-red-500 mx-1" fill="currentColor" /> for medical professionals
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
