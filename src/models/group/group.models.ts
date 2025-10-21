import GroupModel from './group.schema.ts'; // Import Mongoose model của bạn
import type { IGroup, ICreateGroupDTO } from './group.interface.ts'; // Import interfaces


class GroupService {
    private groupModel = GroupModel;
    public async create(groupData: ICreateGroupDTO): Promise<{ valid: boolean; message: string }> {
        try {
            await this.groupModel.create(groupData);
            return { valid: true, message: 'Tạo group thành công' };
        } catch (error: any) {
            console.error("LỖI KHI TẠO GROUP:", error);
            return { valid: false, message: error.message || 'Lỗi không xác định từ database.' };
        }
    }
    public async findGroupsByUserId(userId: string): Promise<{ valid: boolean; groups: IGroup[] | any; message: string }> {
        try {
            const groups = await this.groupModel
                .find({ 'members.user': userId   })
                .sort({ createdAt: -1 });
            return { valid: true, groups, message: 'Lấy danh sách group thành công' };
        } catch (error: any) {
            console.error("LỖI KHI TÌM GROUP:", error);
            return { valid: false, groups: [], message: 'Lỗi server khi lấy danh sách group.' };
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
    public async addMember(groupId: string, userID: string, role: 'member' | 'confirmer'): Promise<{ valid: boolean; message: string }> {
        const getUserRoleInGroup = await this.getUserRoleInGroup(groupId, userID);
        if (getUserRoleInGroup !== 'leader') {
            return { valid: false, message: 'Chi leader moi co quyen them member' }
        }
        try {
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                return { valid: false, message: 'Không tìm thấy group.' };
            }
            group.members.push({ user: userID, role });
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
    public async changeRoleLeader(groupId: string, userID: string, idUserChangeRole: string): Promise<{ valid: boolean; message: string }> {
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
            member.role = 'leader';
            await group.save();
            return { valid: true, message: 'Doi vai trò thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI DOI VAI TRỐ:", error);
            return { valid: false, message: 'Lỗi server khi doi vai trò.' };
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
    public async changeRoleMember(groupId: string, userID: string, idUserChangeRole: string, role: 'member' | 'confirmer'): Promise<{ valid: boolean; message: string }> {
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
            member.role = role;
            await group.save();
            return { valid: true, message: 'Doi vai trò thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI DOI VAI TRỐ:", error);
            return { valid: false, message: 'Lỗi server khi doi vai trò.' };
        }
    }
}

export default new GroupService();