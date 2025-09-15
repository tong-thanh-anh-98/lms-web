// export const apiUrl = import.meta.env.VITE_API_URL;
export const apiUrl = '/api';

export const getToken = () => {
    const userInfo = localStorage.getItem('userInfoLsm');
    return userInfo ? JSON.parse(userInfo).token : null;
};