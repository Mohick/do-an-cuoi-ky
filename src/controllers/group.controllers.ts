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

    /**
     * @desc    Tạo một group mới
     * @route   POST /api/groups
     */
    public createGroup = async (req: IAuthRequest, res: Response): Promise<void> => {
        // [THAY ĐỔI] Thêm một block `finally` để đảm bảo file tạm luôn được xóa
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
    
    /**
     * @desc    Lấy các group của người dùng và phân loại
     * @route   GET /api/groups
    */
   public getMyGroups = async (req: IAuthRequest, res: Response): Promise<void> => {
       // [SỬA] Đổi tên hàm cho đúng convention
       try {
           const { status } = req.query
           const userId = req.userID;
           if (!userId) {
               res.status(400).json({ valid: false, message: "Không tìm thấy ID người dùng." });
               return;
            }
            // Giả sử bạn có hàm findAndCategorizeGroups trong service
            const result = await this.groupService.findGroupsByUserId(userId);
            result.groups = result.groups.map((group:any) => {
                return {
                    ...group.toObject(),
                    image : `${group.image.url}`
                };
            });
            
            console.log(result.groups);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            // [SỬA] Báo lỗi trực tiếp
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };

    /**
     * @desc    Cập nhật trạng thái group
     * @route   PATCH /api/groups/:id/status
     */
    public updateGroupStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await this.groupService.updateStatus(id, status);

            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            // [SỬA] Báo lỗi trực tiếp
            console.error("LỖI KHI CẬP NHẬT STATUS:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };

    /**
     * @desc    Xóa một group
     * @route   DELETE /api/groups/:id
     */
    public deleteGroup = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.groupService.deleteById(id);
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            // [SỬA] Báo lỗi trực tiếp
            console.error("LỖI KHI XÓA GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
}

export default new GroupController();