import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { Search, MapPin, Filter } from 'lucide-react';

const JobsList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        specialization: searchParams.get('specialization') || '',
        location: searchParams.get('location') || '',
        experience: searchParams.get('experience') || '',
    });

    const fetchJobs = async () => {
        setLoading(true);
        try {
            // Build query string filtering out empties
            const validFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
            const query = new URLSearchParams(validFilters).toString();
            setSearchParams(validFilters, { replace: true });
            const { data } = await axios.get(`/api/jobs?${query}`);
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch whenever searchParams changes
        fetchJobs();
    }, [searchParams.get('keyword'), searchParams.get('specialization')]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Auto-fetch when sidebar filters change
    useEffect(() => {
        if (filters.experience !== (searchParams.get('experience') || '')) {
            fetchJobs();
        }
    }, [filters.experience]);

    return (
        <div className="bg-slate-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search Header */}
                <div className="bg-indigo-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">Find Your Next Healthcare Role</h1>
                        <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
                            <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 py-2">
                                <Search className="h-5 w-5 text-slate-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Job title, keyword, or company..."
                                    className="bg-transparent w-full text-slate-900 focus:outline-none"
                                    value={filters.keyword}
                                    onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                />
                            </div>
                            <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 py-2">
                                <Search className="h-5 w-5 text-slate-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Specialization..."
                                    className="bg-transparent w-full text-slate-900 focus:outline-none hidden sm:block"
                                    value={filters.specialization}
                                    onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                                />
                            </div>
                            <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 py-2">
                                <MapPin className="h-5 w-5 text-slate-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Location..."
                                    className="bg-transparent w-full text-slate-900 focus:outline-none"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="bg-primary hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                Search
                            </button>
                        </form>
                    </div>
                    <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                            <div className="flex items-center gap-2 mb-6 text-slate-900 font-semibold border-b pb-4">
                                <Filter className="h-5 w-5" />
                                Filters
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Max Experience Req (Years)</h3>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Any', value: '' },
                                            { label: 'Entry Level (≤ 2 Yrs)', value: '2' },
                                            { label: 'Mid Level (≤ 5 Yrs)', value: '5' },
                                            { label: 'Senior Level (≤ 10 Yrs)', value: '10' }
                                        ].map((level) => (
                                            <label key={level.label} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="experience"
                                                    checked={filters.experience === level.value}
                                                    onChange={() => handleFilterChange('experience', level.value)}
                                                    className="rounded-full text-primary focus:ring-primary h-4 w-4"
                                                />
                                                <span className="text-sm text-slate-600">{level.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Job Type</h3>
                                    <div className="space-y-2">
                                        {['Full-time', 'Part-time', 'Contract', 'Locum Tenens'].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
                                                <span className="text-sm text-slate-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="flex-1">
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Latest Opportunities</h2>
                                <p className="text-slate-500 text-sm mt-1">Showing {jobs.length} jobs available</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-[200px] animate-pulse">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-2/3">
                                                <div className="h-5 bg-slate-100 rounded w-3/4 mb-3"></div>
                                                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                            </div>
                                            <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                                        </div>
                                        <div className="space-y-3 mb-6 mt-2">
                                            <div className="h-3 bg-slate-100 rounded w-10/12"></div>
                                            <div className="h-3 bg-slate-100 rounded w-8/12"></div>
                                        </div>
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                                            <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                                            <div className="h-8 bg-slate-100 rounded w-24"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : jobs.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {jobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Search className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
                                <p className="text-slate-500">Try adjusting your search criteria to find what you're looking for.</p>
                                <button
                                    onClick={() => { setFilters({ keyword: '', specialization: '', location: '', experience: '' }); fetchJobs(); }}
                                    className="mt-6 text-primary font-medium hover:text-indigo-700 underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsList;
