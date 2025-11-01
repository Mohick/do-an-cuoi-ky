import { axiosInstanceJson } from "../axios-instand";







export const deleteAPIJson = async (path: string) => {
    try {
        const res = await axiosInstanceJson.delete(path);
        const data = await res
        return data;
    } catch (error) {
        console.error(error);
    }
}