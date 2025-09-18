import React, { useContext } from 'react';
import { FaChartBar, FaChalkboardTeacher, FaDesktop, FaUserLock } from "react-icons/fa";
import { BsMortarboardFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const UserSidebar = () => {
    const { logout } = useContext(AuthContext);
    const { t } = useTranslation();

    return (
        <div className='card border-0 shadow-lg'>
            <div className='card-body p-4'>
                <ul className='list-unstyled'>
                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/dashboard"><FaChartBar size={16} className='me-2' /> {t('sidebar.dashboard')}</Link>
                    </li>
                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/my-courses"><FaChalkboardTeacher size={16} className='me-2' /> {t('sidebar.my_courses')}</Link>
                    </li>
                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/courses-enrolled"><BsMortarboardFill size={16} className='me-2' /> {t('sidebar.my_learning')}</Link>
                    </li>
                    <li className='d-flex align-items-center mb-3'>
                        <Link to="/account/watch-course/:id"><FaDesktop size={16} className='me-2' /> {t('sidebar.watch_courses')}</Link>
                    </li>
                    <li className='d-flex align-items-center mb-3'>
                        <Link to="#"><FaUserLock size={16} className='me-2' /> {t('sidebar.change_password')}</Link>
                    </li>
                    <li className='d-flex align-items-center'>
                        <Link onClick={logout} className='text-danger' role="button"><MdLogout size={16} className='me-2' /> {t('sidebar.logout')}</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserSidebar;
