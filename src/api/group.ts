import { deleteAPIJson } from "./crud/delete";
import { getAPIJson } from "./crud/get";
import { patchAPIJson } from "./crud/patch";
import { postAPIMultipart } from "./crud/post";
import type { PropsCreateGroup } from "./props/group/props-create";






const createGroupAPI = async (body: PropsCreateGroup) => {
    return await postAPIMultipart(`/api/group/create`, body);
}
const getGroupAPI = async () => {
    return await getAPIJson(`/api/group`);
}
const getRoleGroupAPI = async (id: string, socketID: string) => {
    return await getAPIJson(`/api/group/${id}?socketID=${socketID}`);
}
const updateVerifyJoinGroupAPI = async (body: { id_verify: string }) => {
    return await patchAPIJson(`/api/group/update/verify-join-group`, body);
}
const updateGroupAddMemberAPI = async (body: { id_group: string, userID: string, email: string, groupName: string, username: string }) => {
    return await patchAPIJson(`/api/group/update/add-member`, body);
}
const getMemberHasJoinedGroupAPI = async (id_group: string) => {
    return await getAPIJson(`/api/group/${id_group}/members`);
}
const getMemberNotJoinedGroupAPI = async (id_group: string) => {
    return await getAPIJson(`/api/group/${id_group}/members-not-joined`);
}
const updateChangeRoleLeaderAPI = async (body: { id_group: string, userID: string }) => {
    return await patchAPIJson(`/api/group/update/change-role-leader`, body);
}
const updateChangeRoleConfirmerAPI = async (body: { id_group: string, userID: string }) => {
    return await patchAPIJson(`/api/group/update/change-role-confirmer`, body);
}
const updateChangeRoleMemberAPI = async (body: { id_group: string, userID: string }) => {
    return await patchAPIJson(`/api/group/update/change-role-member`, body);
}
const updateKickMemberAPI = async (body: { id_group: string, userID: string }) => {
    return await patchAPIJson(`/api/group/update/kick-member`, body);
}
const getManagerTaskAPI = async (body: { id_group: string }) => {
    return await getAPIJson(`/api/group/info-group/${body.id_group}`);
}

const getTopFiveMembersAPI = async (body: { id_group: string }) => {
    return await getAPIJson(`api/group/get-top-five-members-better/${body.id_group}`);
}
const patchLeaveGroupAPI = async (body: { id_group: string }) => {
    return await patchAPIJson(`/api/group/update/leave-group`, body);
}
const deleteGroupAPI = async (body: { id_group: string }) => {
    return await deleteAPIJson(`/api/group/delete/${body.id_group}`);
}
export { patchLeaveGroupAPI, deleteGroupAPI, createGroupAPI, getTopFiveMembersAPI, getManagerTaskAPI, updateKickMemberAPI, updateChangeRoleConfirmerAPI, updateChangeRoleMemberAPI, getGroupAPI, getRoleGroupAPI, updateGroupAddMemberAPI, updateVerifyJoinGroupAPI, getMemberHasJoinedGroupAPI, getMemberNotJoinedGroupAPI, updateChangeRoleLeaderAPI }