import { axiosInstanceJson, getCookies } from "../axios-instand";



const patchAPIJson = async (path: string,body?:any, getNotToken: boolean = false) => {
    if (!getCookies().get('token') && !getNotToken) return { blockcall: true };
    const response = await axiosInstanceJson.patch(path,body);
    return response
}

export { patchAPIJson }