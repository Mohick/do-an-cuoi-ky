import { getAPIJson } from "./crud/get";
import { patchAPIJson } from "./crud/patch";
import { postAPIJson } from "./crud/post";
import type { PropsCreateTask, PropsUpdateClaimTask } from "./props/task/create";







const createTaskAPI = async (body: PropsCreateTask) => {
    return await postAPIJson('/api/task/create', body);
}
const getTaskAPI = async (id_group: string) => {
    return await getAPIJson(`/api/task/views-task/${id_group}`);
}
const updateClaimTaskAPI = async (body: PropsUpdateClaimTask) => {
    return await patchAPIJson('/api/task/update/claim-task', body);
}
const updateCancelTaskAPI = async (body: PropsUpdateClaimTask) => {
    return await patchAPIJson('/api/task/update/cancel-task', body);
}
export {
    createTaskAPI,
    getTaskAPI,
    updateClaimTaskAPI,
    updateCancelTaskAPI
}