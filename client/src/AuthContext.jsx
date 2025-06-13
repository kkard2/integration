import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(localStorage.getItem("token") ?? null);

export function AuthProvider({ children }) {
    const token = localStorage.getItem("token")
    const [user, setUser] = useState(token ? { token } : null);

    const login = (userData) => setUser(userData);

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
