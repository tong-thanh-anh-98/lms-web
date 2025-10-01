import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RequireAuth = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Nếu chưa đăng nhập thì redirect về trang login
    if (!user) {
        return <Navigate to={`/login`} />
    }

    // Nếu đã đăng nhập thì render các route con
    return <Outlet />;
}

export default RequireAuth