import { axiosInstanceJson, axiosInstanceMultipart } from "../axios-instand";


const postAPIJson = async (path: string, body: { [key: string]: any }) => {
    const response = await axiosInstanceJson.post(path, body);
    if(response.data.cookies) {
        window.localStorage.setItem('token', response.data.cookies)
    }
    return response
}
const postAPIMultipart = async (path: string, body: { [key: string]: any }) => {
    const response = await axiosInstanceMultipart.post(path, body);
    return response
}

export { postAPIJson, postAPIMultipart }