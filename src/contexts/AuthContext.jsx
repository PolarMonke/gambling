import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        console.log("AuthProvider mounted - checking for existing auth");
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        console.log("Found token:", !!token, "Found user data:", !!userData);
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                console.log("Setting user:", parsedUser);
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse user data:", e);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
        }
    };
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);