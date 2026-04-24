import { axiosInstanceJson } from "../axios-instand";



const getAPIJson = async (path: string) => {
    const response = await axiosInstanceJson.get(path);
    return response
}




export { getAPIJson }