import GroupModel from './group.schema.ts'; // Import Mongoose model của bạn
import type mongoose from 'mongoose';
import Task from '../task/task.schema.ts';
import type { ICreateGroupDTO } from '../../unit/type_project/group/icreate_group_dto.type.ts';
import type { ICreateGroupResponse } from '../../unit/type_project/group/response_create_group.type.ts';
import type { IGroup, IGroupMember } from '../../unit/type_project/group/schema.type.ts';
import type { Types } from 'mongoose';



class GroupService {
    private groupModel = GroupModel;
    private taskModel = Task;
    public async create(groupData: ICreateGroupDTO): Promise<ICreateGroupResponse> {
        try {
            const group = (await this.groupModel.create(groupData)) as unknown as IGroup;
            return { valid: true, message: 'Tạo group thành công', group: group.toObject() };
        } catch (error: any) {
            console.error("LỖI KHI TẠO GROUP:", error);
            return { valid: false, message: error.message || 'Lỗi không xác định từ database.' };
        }
    }
    public async findGroupsByUserId(userId: string, limit: number, page: number): Promise<{ valid: boolean; groups: IGroup[]; message: string, hasMore?: boolean }> {
        try {
            const limitNum = Number(limit);
            const pageNum = Number(page);
            const groups = await this.groupModel
                .find({
                    members: {
                        $elemMatch: {
                            user: userId,
                            joined: true
                        }
                    }
                })
                .limit(limitNum + 1)
                .skip((pageNum - 1) * limitNum)
                .sort({ deadline: 1 })
                .populate('creator', 'username email avatar') as unknown as IGroup[];
            const hasMore = groups.length > limitNum;
            const finalGroups = hasMore ? groups.slice(0, limitNum) : groups;
            return {
                valid: true,
                groups: finalGroups,
                message: 'Lấy danh sách group thành công',
                hasMore: hasMore
            };
        } catch (error) {
            console.error("LỖI KHI TÌM GROUP:", error);
            return { valid: false, groups: [], message: 'Lỗi server khi lấy danh sách group.' };
        }
    }
    public async getRoleGroup(groupId: string, userId: string): Promise<{ valid: boolean; message: string; Role?: string }> {
        try {
            const group = await this.groupModel.findOne(
                { _id: groupId, 'members.user': userId },
                { 'members.$': 1 }
            )

            if (!group) {
                return { valid: false, message: 'Không tìm thấy group hoặc user không phải là thành viên.' };
            }
            const role = group.members[0].role;
            return {
                valid: true,
                Role: role,
                message: 'Lấy vai trò thành công.'
            };
        } catch (error: any) {
            console.error("LỖI KHI LẤY VAI TRÒ GROUP:", error);
            return { valid: false, message: 'Lỗi server khi lấy vai trò.' };
        }
    }
    public async deleteById(groupId: string, userID: string): Promise<{ valid: boolean; message: string }> {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, userID);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen xoa group' }
            }
            const deletedGroup = await this.groupModel.findByIdAndDelete(groupId);
            if (!deletedGroup) {
                return { valid: false, message: 'Không tìm thấy group để xóa.' };
            }
            return { valid: true, message: 'Xóa group thành công.' };
        } catch (error: any) {
            console.error("LỖI KHI XÓA GROUP:", error);
            return { valid: false, message: 'Lỗi server khi xóa group.' };
        }
    }
    public async getUserRoleInGroup(groupId: string, userID: string): Promise<'leader' | 'member' | 'confirmer' | ""> {
        try {
            const group = await this.groupModel.findById(groupId, 'members.user members.role').lean() as unknown as IGroup;
            if (!group) {
                return "";
            }
            const member = group.members.find((m) => m.user.equals(userID));
            if (!member) {
                return "";
            }
            return member.role;
        } catch (error) {
            console.error("Lỗi khi lấy vai trò user trong group:", error);
            return "";
        }
    }
    public async addMember(groupId: string, userID: string): Promise<{ valid: boolean; message: string }> {
        try {
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            let hasJoin = false;
            group.members.forEach((member) => {
                if (member.user.equals(userID)) {
                    hasJoin = true;
                }
            })
            if (hasJoin) {
                return { valid: false, message: 'User đa học group' };
            }
            group.members.push({ user: userID, role: "member" });
            await group.save();
            return { valid: true, message: 'Them member thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI THEM MEMBER:", error);
            return { valid: false, message: 'Lỗi server khi them member.' };
        }
    }
    public async changeRoleLeader(groupId: string, userID: string, idUserChangeRole: mongoose.Types.ObjectId): Promise<{ valid: boolean; message: string }> {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, `${userID}`);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen doi vai trò' };
            }
            const group = await this.groupModel.findById(groupId) as unknown as IGroup;
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const newLeader = group.members.find((m) => m.user.equals(idUserChangeRole));
            if (!newLeader) {
                return { valid: false, message: 'Không tìm thấy user trong group.' };
            }
            const currentLeader = group.members.find((m) => m.role === 'leader');

            if (currentLeader) {
                if (!currentLeader.user.equals(idUserChangeRole)) {
                    currentLeader.role = 'member';
                }
            }
            newLeader.role = 'leader';
            group.creator = idUserChangeRole
            await group.save();
            return { valid: true, message: 'Đổi vai trò thành công' };
        } catch (error: any) {
            console.error("LỖI KHI ĐỔI VAI TRÒ:", error);
            return { valid: false, message: 'Lỗi server khi đổi vai trò.' };
        }
    }
    public async deleteMember(groupId: string, userID: string, idUserDelete: string): Promise<{ valid: boolean; message: string }> {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, userID);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen xoa member' }
            }
            const group = await this.groupModel.findById(groupId) as unknown as IGroup;
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const getDel = group.members.filter((m) => !m.user.equals(idUserDelete));
            group.members = getDel;
            await group.save();
            return { valid: true, message: 'Xoa member thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI XÓA MEMBER:", error);
            return { valid: false, message: 'Lỗi server khi xóa member.' };
        }
    }
    public async changeRoleMember(groupId: string, userID: string, idUserChangeRole: string): Promise<{ valid: boolean; message: string }> {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, userID);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen doi vai trò' };
            }
            const group = await this.groupModel.findById(groupId) as unknown as IGroup;
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const member = group.members.find((m) => m.user.equals(idUserChangeRole));
            if (!member) {
                return { valid: false, message: 'Không tìm thấy user trong group.' };
            }
            member.role = "member";
            await group.save();
            return { valid: true, message: 'Doi vai trò thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI DOI VAI TRỐ:", error);
            return { valid: false, message: 'Lỗi server khi doi vai trò.' };
        }
    }
    public async changeRoleConfirmer(groupId: string, userID: string, idUserChangeRole: string): Promise<{ valid: boolean; message: string }> {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, userID);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen doi vai trò' };
            }
            const group = await this.groupModel.findById(groupId) as unknown as IGroup;
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const member = group.members.find((m) => m.user.equals(idUserChangeRole));
            if (!member) {
                return { valid: false, message: 'Không tìm thấy user trong group.' };
            }
            member.role = 'confirmer';
            await group.save();
            return { valid: true, message: 'Doi vai trò thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI DOI VAI TRỐ:", error);
            return { valid: false, message: 'Lỗi server khi doi vai trò.' };
        }
    }
    public async getFullMemberIngroup(groupId: string): Promise<{ valid: boolean; members: any; message: string }> {
        try {
            const group = await this.groupModel.findById(groupId, 'members.user members.role').lean();
            if (!group) {
                return { valid: false, members: [], message: 'Không tìm thấy group.' };
            }
            return { valid: true, members: group.members, message: 'Lấy danh sách member trong group thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI TÌM GROUP:", error);
            return { valid: false, members: [], message: 'Lỗi server khi tìm group.' };
        }
    }
    public async inviteJoinGroup(groupId: string, idUserInvite: string): Promise<{ valid: boolean; message: string, name_group?: string }> {
        try {
            const group = await this.groupModel.findById(groupId) as unknown as IGroup;
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            group.members.push({ user: idUserInvite, role: 'member' });
            await group.save();
  
            return { valid: true, message: 'Invite thanh cong', name_group: group.projectName };
        } catch (error: any) {
            console.error("LỖI KHI INVITE:", error);
            return { valid: false, message: 'Lỗi server khi invite.' };
        }
    }
    public async ActiveJoinGroup(groupId: string, idUserInvite: string): Promise<{ valid: boolean; message: string }> {
        try {
            const group = await this.groupModel.findById(groupId) as unknown as IGroup;
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const getDel = group.members.map((m) => {
                if (m.user.equals(idUserInvite)) {
                    m.joined = true;
                }
                return m;
            });
            group.members = getDel as IGroupMember[];
            await group.save();
            return { valid: true, message: 'Active thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI ACTIVE:", error);
            return { valid: false, message: 'Lỗi server khi active.' };
        }
    }
    public async getListMemberIngroupHasJoined(groupId: string): Promise<{ valid: boolean; members: any; message: string }> {
        try {
            const group = await this.groupModel.findById(groupId, 'members.user members.joined members.role')
                .populate('members.user', 'username avatar _id email').lean();

            if (!group) {
                return { valid: false, members: [], message: 'Không tìm thấy group.' };
            }
            return { valid: true, members: group.members.filter((m: any) => m.joined === true), message: 'Lấy danh sách member trong group thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI TÌM GROUP:", error);
            return { valid: false, members: [], message: 'Lỗi server khi tìm group.' };
        }
    }
    public async getListMemberIngroupHasNotJoined(groupId: string): Promise<{ valid: boolean; members: any; message: string }> {
        try {
            const group = await this.groupModel.findById(groupId, 'members.user members.joined members.role')
                .populate('members.user', 'username avatar _id email').lean();
            if (!group) {
                return { valid: false, members: [], message: 'Không tìm thấy group.' };
            }
            return { valid: true, members: group.members.filter((m: any) => m.joined === false), message: 'Lấy danh sách member trong group thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI TÌM GROUP:", error);
            return { valid: false, members: [], message: 'Lỗi server khi tìm group.' };
        }
    }
    public kickMember = async (groupId: string, userID: string, idUserKick: string) => {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, userID);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen doi vai trò' };
            }
            const group = await this.groupModel.findById(groupId);

            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const getDel = group.members.filter((m: any) => !m.user.equals(idUserKick));
            group.members = getDel as any;
            await group.save();
            return { valid: true, message: 'Kick member thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI KICK MEMBER:", error);
            return { valid: false, message: 'Lỗi server khi kick member.' };
        }
    }
    public topFiveMemberCompletedTaskMore = async (groupId: string): Promise<{ valid: boolean; message: string; topMember?: any }> => {
        try {
            return Promise.all([
                this.taskModel.find({ id_group: groupId, status: 'completed' }).populate('implementer', 'username email avatar'),
                this.groupModel.findById(groupId).populate('members.user', 'username email avatar')
            ]).then(([tasks, group]) => {
                if (!group) {
                    return { valid: false, message: 'Không tìm thấy group.' };
                }
                const listMember = group.members.reduce((list: any, member: any) => {
                    const acc = {} as any;
                    if (member.joined === true) {

                        acc.role = member.role;
                        acc._id = member.user._id;
                        acc.username = member.user.username;
                        acc.email = member.user.email;
                        list.push(acc);
                        return list;
                    }
                    return list;
                }, []);
                const countTask = {} as { [key: string]: number };
                tasks.forEach((task: any) => {
                    if (task.implementer) {
                        const id = task.implementer._id.toString();
                        countTask[id] = (countTask[id] || 0) + 1;
                    }
                });
                const topMember = listMember.map((member: any) => {
                    return {
                        ...member,
                        totalTasksCompleted: countTask[member._id.toString()] || 0
                    }
                });
                topMember.sort((a: any, b: any) => {
                    const countA = countTask[a._id.toString()] || 0;
                    const countB = countTask[b._id.toString()] || 0;
                    return countB - countA;
                });

                return { valid: true, message: 'Lấy top member thành công', topMember };
            });
        } catch (error: any) {
            console.error("LỖI KHI TÌM TOP MEMBER VÀ ROLE:", error);
            return { valid: false, message: 'Lỗi server khi tìm top member và role.' };
        }
    }
    public updateInfoGroup = async ({ groupId, userID, body }: {
        groupId: string, userID: string, body: {
            projectName: string,
            image: string
            deadline: string
            creator: string
        }
    }) => {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, userID);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen doi vai trò' };
            }
            await this.groupModel.updateOne(body);
            return { valid: true, message: 'Cập nhật thành công ' };
        } catch (error: any) {
            console.error("LỖI KHI KICK MEMBER:", error);
            return { valid: false, message: 'Lỗi server khi kick member.' };
        }
    }
    public leaveGroup = async (groupId: string, userID: string) => {
        try {
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const getDel = group.members.filter((m: any) => !m.user.equals(userID));
            group.members = getDel as any;
            await group.save();
            return { valid: true, message: 'Rời nhóm thành công' };
        } catch (error: any) {
            console.error("LỖI KHI RỜI NHÓM:", error);
            return { valid: false, message: 'Lỗi server khi rời nhóm.' };
        }
    }
    public deleteGroup = async (groupId: string, userID: string) => {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, userID);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen xoa group' }
            }
            const deletedGroup = await this.groupModel.findByIdAndDelete(groupId);

            if (!deletedGroup) {
                return { valid: false, message: 'Không tìm thấy group để xóa.' };
            }
            return { valid: true, message: 'Xóa group thành công.', img_public_id: deletedGroup.image?.public_id };
        } catch (error: any) {
            console.error("LỖI KHI XÓA GROUP:", error);
            return { valid: false, message: 'Lỗi server khi xóa group.' };
        }
    }
    public updateGroup = async (idGroup: string, userID: string, infoUpdate: any) => {
        try {
            const getUserRoleInGroup = await this.getUserRoleInGroup(`${idGroup}`, userID);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen xoa group' }
            }
            const result = await this.groupModel.findByIdAndUpdate({ _id: idGroup }, infoUpdate);
            return { valid: true, message: 'Cập nhật group thành cong' };
        } catch (error: any) {
            console.error("LỖI KHI CÂP NHẤT GROUP:", error);
            return { valid: false, message: 'Lỗi server khi cập nhật group.' };
        }
    }
}

export default new GroupService();