import axios from "axios";






export const getLocalStorage = (str:string) => {

    
    return localStorage.getItem('token')
}

const axiosInstanceJson = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    headers: {
        'Content-Type': 'application/json',
    },withCredentials:true
});
const axiosInstanceMultipart = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },withCredentials:true
});
axiosInstanceMultipart.interceptors.request.use((config) => {
    const token = getLocalStorage('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})
axiosInstanceJson.interceptors.request.use((config) => {
    const token = getLocalStorage('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
export { axiosInstanceJson, axiosInstanceMultipart }