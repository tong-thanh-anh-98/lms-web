import { useState } from "react";
import { toast } from 'react-toastify';
import { AuthContext } from "./AuthContext";
import { useTranslation } from 'react-i18next';

// export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { t } = useTranslation();
    const userInfo = localStorage.getItem('userInfoLsm');
    const [user, setUser] = useState(userInfo);

    const login = (user) => {
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('userInfoLsm');
        setUser(null);
        toast.success(t('message.logout'));
    }

    return <AuthContext.Provider
        value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
}