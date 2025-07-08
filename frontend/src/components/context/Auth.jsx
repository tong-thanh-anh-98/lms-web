import { useState } from "react";
import { toast } from 'react-toastify';
import { AuthContext } from "./AuthContext";

// export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const userInfo = localStorage.getItem('userInfoLsm');
    const [user, setUser] = useState(userInfo);

    const login = (user) => {
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('userInfoLsm');
        setUser(null);

        toast.success('You have logged out of your account.');
    }

    return <AuthContext.Provider
        value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
}