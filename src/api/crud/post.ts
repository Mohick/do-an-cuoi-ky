import { axiosInstanceJson, axiosInstanceMultipart } from "../axios-instand";


const postAPIJson = async (path: string, body: { [key: string]: any }) => {
    const response = await axiosInstanceJson.post(path, body);
    return response
}
const postAPIMultipart = async (path: string, body: { [key: string]: any }) => {
    const response = await axiosInstanceMultipart.post(path, body);
    return response
}

export { postAPIJson, postAPIMultipart }