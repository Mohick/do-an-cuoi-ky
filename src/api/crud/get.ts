import { axiosInstanceJson, getCookies } from "../axios-instand";



const getAPIJson = async (path: string, getNotToken: boolean = false) => {
    const response = await axiosInstanceJson.get(path);
    return response
}




export { getAPIJson }