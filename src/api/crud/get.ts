import { axiosInstanceJson, getCookies } from "../axios-instand";



const getAPIJson = async (path: string, getNotToken: boolean = false) => {
    if (!getCookies().get('token') && !getNotToken) return { blockcall: true };
    const response = await axiosInstanceJson.get(path);
    return response
}




export { getAPIJson }