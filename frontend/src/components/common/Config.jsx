export const apiUrl = import.meta.env.VITE_API_URL || '/api';

export const getToken = () => {
    const userInfo = localStorage.getItem('userInfoLsm');
    return userInfo ? JSON.parse(userInfo).token : null;
};