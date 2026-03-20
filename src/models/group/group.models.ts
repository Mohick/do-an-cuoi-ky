import GroupModel from './group.schema.ts'; // Import Mongoose model của bạn
import type { IGroup, ICreateGroupDTO } from './group.interface.ts'; // Import interfaces
import type { Type } from 'typescript';
import type mongoose from 'mongoose';


class GroupService {
    private groupModel = GroupModel;
    public async create(groupData: ICreateGroupDTO): Promise<{ valid: boolean; message: string, group?: any }> {
        try {
            const group = (await this.groupModel.create(groupData))
            const newGroup = await group.populate('creator', 'username email avatar');
            return { valid: true, message: 'Tạo group thành công', group: newGroup };
        } catch (error: any) {
            console.error("LỖI KHI TẠO GROUP:", error);
            return { valid: false, message: error.message || 'Lỗi không xác định từ database.' };
        }
    }
    public async findGroupsByUserId(userId: string): Promise<{ valid: boolean; groups: IGroup[] | any; message: string }> {
        try {
            const groups = await this.groupModel
                .find({ 'members.user': userId })
                .sort({ createdAt: -1 }).populate('creator', 'username email avatar');
            return { valid: true, groups, message: 'Lấy danh sách group thành công' };
        } catch (error: any) {
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
            console.log(group);

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
    public async addMember(groupId: string, userID: string): Promise<{ valid: boolean; message: string }> {
        try {
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            group.members.push({ user: userID, role: "member" });
            await group.save();
            return { valid: true, message: 'Them member thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI THEM MEMBER:", error);
            return { valid: false, message: 'Lỗi server khi them member.' };
        }
    }
    public async getUserRoleInGroup(groupId: string, userID: string): Promise<'leader' | 'member' | 'confirmer' | ""> {
        try {
            const group = await this.groupModel.findById(groupId, 'members.user members.role').lean();
            if (!group) {
                return "";
            }
            const member = group.members.find((m: any) => m.user.equals(userID));

            if (!member) {
                return "";
            }
            return member.role;
        } catch (error) {
            console.error("Lỗi khi lấy vai trò user trong group:", error);
            return "";
        }
    }
    public async changeRoleLeader(groupId: string, userID: string, idUserChangeRole: mongoose.Types.ObjectId): Promise<{ valid: boolean; message: string }> {
        try {
            // 1. Authorization and Group Check
            const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, `${userID}`);
            if (getUserRoleInGroup !== 'leader') {
                return { valid: false, message: 'Chi leader moi co quyen doi vai trò' };
            }
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }

            // 2. Find the member to be promoted (the new leader)
            const newLeader = group.members.find((m: any) => m.user.equals(idUserChangeRole));

            if (!newLeader) {
                return { valid: false, message: 'Không tìm thấy user trong group.' };
            }

            // 3. Find the CURRENT leader and demote them to 'member'
            // We use find() to get the current leader object
            const currentLeader = group.members.find((m: any) => m.role === 'leader') as any;

            if (currentLeader) {
                // Check to prevent self-demotion if they are promoting themselves (though usually not necessary)
                if (!currentLeader.user.equals(idUserChangeRole)) {
                    currentLeader.role = 'member'; // ⬅️ DEMOTE THE OLD LEADER
                }
            }

            // 4. Promote the designated user to 'leader'
            newLeader.role = 'leader'; // ⬅️ PROMOTE THE NEW LEADER
            group.creator = idUserChangeRole
            // 5. Save the changes to the database
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
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const getDel = group.members.filter((m: any) => !m.user.equals(idUserDelete));
            group.members = getDel as any;
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
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const member = group.members.find((m: any) => m.user.equals(idUserChangeRole));
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
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const member = group.members.find((m: any) => m.user.equals(idUserChangeRole));
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
    public async inviteJoinGroup(groupId: string, idUserInvite: string): Promise<{ valid: boolean; message: string }> {
        try {
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            group.members.push({ user: idUserInvite, role: 'member' });
            await group.save();
            return { valid: true, message: 'Invite thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI INVITE:", error);
            return { valid: false, message: 'Lỗi server khi invite.' };
        }
    }
    public async ActiveJoinGroup(groupId: string, idUserInvite: string): Promise<{ valid: boolean; message: string }> {
        try {
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            const getDel = group.members.map((m: any) => {
                if (m.user.equals(idUserInvite)) {
                    m.joined = true;
                }
                return m;
            });
            group.members = getDel as any;
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
            return { valid: true, message: 'Xóa group thành công.' };
        } catch (error: any) {
            console.error("LỖI KHI XÓA GROUP:", error);
            return { valid: false, message: 'Lỗi server khi xóa group.' };
        }
    }

}

export default new GroupService();