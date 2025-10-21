import { getAPIJson } from "./crud/get";
import { patchAPIJson } from "./crud/patch";
import { postAPIJson } from "./crud/post"
import type { PropsRegister } from "./props/user/props-register";
import type { PropsLogin } from "./props/user/props-sigin";



//user
const registerAPI = async (body: PropsRegister) => {
    const post = await postAPIJson('/api/user/create', body);
    return post
}
const loginAPI = async (body: PropsLogin) => {
    const post = await postAPIJson('/api/user/login', body);
    return post
}
const autoLoginAPI = async () => {
    const post = await getAPIJson('/api/user/auto-login');
    return post
}
const verifyEmailAPI = async () => {
    const post = await getAPIJson(`/api/user/verify-email`);
    return post
}
const checkVerifyAPI = async (body:any) => {
    return await patchAPIJson(`/api/user/check-verify`,body);
}
export { registerAPI, loginAPI, autoLoginAPI, verifyEmailAPI,checkVerifyAPI }