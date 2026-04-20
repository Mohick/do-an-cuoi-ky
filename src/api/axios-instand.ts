import axios from "axios";






export const getCookies = () => {
    const cookieString = document.cookie
   
    
    const map = new Map()
    if (cookieString) {
        cookieString.split(';').forEach((cookie) => {
            const [key, value] = cookie.split('=')
            map.set(key.trim(), value.trim())
        })
        
        return map
    }
    
    return map
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
    const token = getCookies().get('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})
axiosInstanceJson.interceptors.request.use((config) => {
    const token = getCookies().get('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
export { axiosInstanceJson, axiosInstanceMultipart }