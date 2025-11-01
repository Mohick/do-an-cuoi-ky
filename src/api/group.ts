import { getAPIJson } from "./crud/get";
import { postAPIJson, postAPIMultipart } from "./crud/post";
import type { PropsCreateGroup } from "./props/group/props-create";






const createGroupAPI = async (body: PropsCreateGroup) => {
    return await postAPIMultipart(`/api/group/create`, body);
}
const getGroupAPI = async () => {
    return await getAPIJson(`/api/group?status=${status}`);
}
const getRoleGroupAPI = async (id: string) => {
    return await getAPIJson(`/api/group/${id}`);
}

export { createGroupAPI, getGroupAPI, getRoleGroupAPI }