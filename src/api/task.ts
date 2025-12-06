import { deleteAPIJson } from "./crud/delete";
import { getAPIJson } from "./crud/get";
import { patchAPIJson } from "./crud/patch";
import { postAPIJson } from "./crud/post";
import type { PropsCreateTask, PropsUpdateClaimTask } from "./props/task/create";







const createTaskAPI = async (body: PropsCreateTask) => {
    return await postAPIJson('/api/task/create', body);
}
const getListTaskAwaitingAPI = async (id_group: string) => {
    return await getAPIJson(`/api/task/${id_group}/waiting`);
}
const getMyTaskAPI = async (id_group: string) => {
    return await getAPIJson(`/api/task/${id_group}/getMyTask`);
}
const updateClaimTaskAPI = async (body: PropsUpdateClaimTask) => {
    return await patchAPIJson('/api/task/update/claim-task', body);
}
const updateCancelTaskAPI = async (body: PropsUpdateClaimTask) => {
    return await patchAPIJson('/api/task/update/cancel-task', body);
}
const deleteTaskAPI = async (id_task: string, id_group: string) => {
    return await deleteAPIJson(`/api/task/delete/${id_task}?id_group=${id_group}`);
}
const claimTaskAPI = async (id_task: { id_task: string, id_group: string }) => {
    return await patchAPIJson(`/api/task/update/claim-task`, id_task);
}
const sendRequireVeryTaskAPI = async (id_task: { id_task: string, id_group: string }) => {
    return await patchAPIJson(`/api/task/update/sendRequireVeryTask`, id_task);
}
const completeTaskAPI = async (body: { id_task: string, id_group: string }) => {
    return await patchAPIJson(`/api/task/update/completeTask`, body);
}
const rollbackTaskAPI = async (body: { id_task: string, id_group: string }) => {
    return await patchAPIJson(`/api/task/update/rollbackTask`, body);
}
const rejectTaskAPI = async (body: { id_task: string, id_group: string }) => {
    return await patchAPIJson(`/api/task/update/rejectTask`, body);
}
const cancelTaskAPI = async (body: { id_task: string, id_group: string }) => {
    return await patchAPIJson(`/api/task/update/cancelTask`, body);
}
const getPendingTaskAPI = async (id_group: string) => {
    return await getAPIJson(`/api/task/${id_group}/getListPendingTask`);
}
const getCompleteTaskAPI = async (id_group: string) => {
    return await getAPIJson(`/api/task/${id_group}/getListCompleteTask`);
}
const getCommentInTaskAPI = async (body: { userID: string, id_task: string, comment: string , id_group: string}) => {
    return await patchAPIJson(`/api/task/comment-task`, body);
}
export {
    createTaskAPI,
    getCommentInTaskAPI,
    getListTaskAwaitingAPI,
    updateClaimTaskAPI,
    updateCancelTaskAPI,
    deleteTaskAPI,
    claimTaskAPI,
    sendRequireVeryTaskAPI,
    completeTaskAPI,
    rollbackTaskAPI,
    rejectTaskAPI,
    cancelTaskAPI,
    getMyTaskAPI, getCompleteTaskAPI,
    getPendingTaskAPI
}