import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Set default axios interceptors or base URL
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.withCredentials = true;

    // Axios Interceptor for adding the Authorization header
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const { data } = await axios.get('/api/auth/me');
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        const { token } = response.data;
        if (token) {
            localStorage.setItem('token', token);
        }
        // Retrieve fresh user data to ensure the session and cookies are fully active
        const { data: userData } = await axios.get('/api/auth/me');
        setUser({ ...userData, role: userData.role });
        return userData;
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    const registerDoctor = async (doctorData) => {
        await axios.post('/api/auth/register/doctor', doctorData);
        const { data: userData } = await axios.get('/api/auth/me');
        setUser({ ...userData, role: userData.role });
        return userData;
    };

    const registerHospital = async (hospitalData) => {
        await axios.post('/api/auth/register/hospital', hospitalData);
        const { data: userData } = await axios.get('/api/auth/me');
        setUser({ ...userData, role: userData.role });
        return userData;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, registerDoctor, registerHospital, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
