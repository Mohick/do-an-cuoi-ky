import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import GroupService from "../models/group/group.models.ts";
import { cloudinary } from "../third-party/upload-images/multer.ts";
import type { url } from "inspector";
import userModels from "../models/user/user.models.ts";
import { templateEmailJoinGroup } from "../third-party/send-email/template-send-join-group.ts";
import { storeRedis } from "../third-party/redis/redis.ts";
import TaskService from "../models/task/task.models.ts";
import { getIO } from "../third-party/socket/socket.ts";
interface IAuthRequest extends Request {
    userID?: string;
}

class GroupController {
    private groupService = GroupService;
    private userService = userModels;
    private taskService = TaskService;
    getRoleMember = async (req: IAuthRequest, res: Response): Promise<void> => {
        const { id_group } = req.params;
        const userId = req.userID;
        const result = await this.groupService.getRoleGroup(id_group, userId as string);
        res.status(result.valid ? 200 : 400).json(result);
    }
    public createGroup = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { name_project, deadline } = req.body;
            const creator = req.userID;
            if (!req.files || !creator) {
                res.status(400).json({ valid: false, message: "Thiếu file ảnh hoặc thông tin người tạo." });
                return;
            }
            const fileImg = (req.files as any)[0]
            console.log(fileImg.path,process.env.CLOUDINARY_NAME,process.env.CLOUDINARY_PRESET);
            
            const uploadResult = await cloudinary.uploader.unsigned_upload(
                fileImg.path,
                process.env.CLOUDINARY_PRESET as string,
                {
                    folder: "uploads",
                }
            );
            
            await fs.unlink(fileImg.path);
            const groupData = {
                projectName: name_project,
                creator,
                deadline: new Date(deadline),
                image: {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                },
            };
         

            const result = await this.groupService.create(groupData);
            if (result.valid) {
                const newObject = result.group.toObject();

                getIO().emit('new-group', {
                    ...newObject,
                    image: `${newObject.image.url}`
                });
                res.status(result.valid ? 201 : 400).json(result);
            }
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI TẠO GROUP:", error);
            if (error.name === 'ValidationError' || error.code === 11000) {
                res.status(400).json({ valid: false, message: "Dữ liệu không hợp lệ hoặc đã tồn tại." });
                return;
            }
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
    public getMyGroups = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { status } = req.query
            const userId = req.userID;
            if (!userId) {
                res.status(400).json({ valid: false, message: "Không tìm thấy ID người dùng." });
                return;
            }
          
            
            const result = await this.groupService.findGroupsByUserId(userId);
            result.groups = result.groups.map((group: any) => {
                return {
                    ...group.toObject(),
                    image: `${group.image.url}`
                };
            });

            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
    public addMember = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const { userID } = req.body;
            const result = await this.groupService.addMember(id_group, userID);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public getMemberIngroup = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const result = await this.groupService.getFullMemberIngroup(id_group);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    inviteJoinGroup = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { userID, id_group, email, groupName, username } = req.body;
            if (!userID || !id_group || !email) {
                res.status(400).json({ valid: false, message: "Thiếu thông tin cần thiết." });
                return;
            }

            const result = await this.groupService.inviteJoinGroup(id_group, userID);

            if (!result.valid) {
                res.status(400).json(result);
                return;
            }

            const redisKey = `${id_group}:${userID}`;
            const urlCheck = `${process.env.CLI_URL}/join-group?id_verify=${encodeURIComponent(redisKey)}`;

            // 🔒 Lưu Redis 5 phút
            await storeRedis.set(redisKey, JSON.stringify({ id_group, userID }), { EX: 300 });

            // 📧 Gửi email mời
            await templateEmailJoinGroup(email, urlCheck, username, groupName);

            res.status(201).json({
                valid: true,
                message: "Đã gửi lời mời tham gia nhóm thành công.",
                link: urlCheck,
            });
        } catch (error: any) {
            console.error("LỖI KHI MỜI NGƯỜI DÙNG:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
    verifyJoinGroup = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { id_verify } = req.body;

            if (!id_verify) {
                res.status(400).json({ valid: false, message: "Thiếu mã xác thực." });
                return;
            }

            const cache = await storeRedis.get(id_verify);
            if (!cache) {
                res.status(400).json({ valid: false, message: "Mã xác thực không hợp lệ hoặc đã hết hạn." });
                return;
            }

            // 🔍 Giải mã chuỗi JSON từ Redis
            const { id_group, userID } = JSON.parse(cache);

            const result = await this.groupService.ActiveJoinGroup(id_group, userID);

            // ✅ Xóa key Redis sau khi xác minh thành công để tránh reuse link
            if (result.valid) {
                await storeRedis.del(id_verify);
            }
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI XÁC MINH THAM GIA NHÓM:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
    public getListMemberIngroupHasJoined = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const result = await this.groupService.getListMemberIngroupHasJoined(id_group);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public getListMemberIngroupHasNotJoined = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const result = await this.groupService.getListMemberIngroupHasNotJoined(id_group);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public changeRoleLeader = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const idLeader = req.userID;
            const { userID, id_group } = req.body;
            const result = await this.groupService.changeRoleLeader(id_group, idLeader as string, userID);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public changeRoleMember = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const idLeader = req.userID;
            const { userID, id_group } = req.body;
            const result = await this.groupService.changeRoleMember(id_group, idLeader as string, userID);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public changeRoleConfirmer = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const idLeader = req.userID;
            const { userID, id_group, role } = req.body;
            const result = await this.groupService.changeRoleConfirmer(id_group, idLeader as string, userID);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public kickMember = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const idLeader = req.userID;
            const { id_group, userID } = req.body;
            const result = await this.groupService.kickMember(id_group, idLeader as string, userID);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public getInfoGroup = async (req: IAuthRequest, res: Response) => {
        try {
            const userID = req.userID;
            const { id_group } = req.params;
            const checkMember = await this.groupService.getRoleGroup(id_group, `${userID}`);
            if (!checkMember.valid) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
            }
            const result = await this.taskService.getInfoTask(id_group);

            res.status(result.valid ? 201 : 400).json(result);
        } catch (error) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }

    }
    public topFiveMemberCompletedTaskMore = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const result = await this.groupService.topFiveMemberCompletedTaskMore(`${id_group}`);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public leaveGroup = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const userID = req.userID;
            const { id_group } = req.body;
            const result = await this.groupService.leaveGroup(id_group, `${userID}`);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI RỜI NHÓM:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public deleteGroup = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const userID = req.userID;
            const { id_group } = req.params;
            const result = await this.groupService.deleteGroup(id_group, `${userID}`);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI XOA NHÓM:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
}

export default new GroupController();