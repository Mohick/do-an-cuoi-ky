import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import GroupService from "../models/group/group.models.ts";
import { cloudinary } from "../third-party/upload-images/multer.ts";
import type { url } from "inspector";

interface IAuthRequest extends Request {
    userID?: string;
}

class GroupController {
    private groupService = GroupService;
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
            const uploadResult = await cloudinary.uploader.upload(fileImg.path, {
                folder: "uploads",
            });
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
            result.groups = result.groups.map((group:any) => {
                return {
                    ...group.toObject(),
                    image : `${group.image.url}`
                };
            });
            
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };

}

export default new GroupController();