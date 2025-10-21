import { axiosInstanceJson } from "../axios-instand";







const deleteAPI = async (path: string) => {
    try {
        const res = await axiosInstanceJson(path);
        const data = await res
        return data;
    } catch (error) {
        console.error(error);
    }
}