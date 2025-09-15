// export const apiUrl = import.meta.env.VITE_API_URL;
export const apiUrl = '/api';

const userInfo = localStorage.getItem('userInfoLsm');

export const token = userInfo ? JSON.parse(userInfo).token : null;