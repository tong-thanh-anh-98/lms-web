import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// const RequireAuth = ({ children }) => {
//     const { user } = useContext(AuthContext);
//     if (!user) {
//         return <Navigate to={`/account/login`} />
//     }
//     return children;
// }

const RequireAuth = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to={`/account/login`} />
    }

    // khi dùng <RequireAuth /> trong App.jsx bọc các route con bên trong mà không hiển thị trang trắng.
    return <Outlet />;
}

export default RequireAuth