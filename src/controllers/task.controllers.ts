import type { Request, Response } from "express";
import TaskService from "../models/task/task.models";
import GroupService from "../models/group/group.models.ts";


class TaskController {
    // [SỬA] Sử dụng trực tiếp instance duy nhất từ Service
    private taskService = TaskService;
    private groupService = GroupService;
    /**
     * @desc    Tạo task mới (chỉ leader)
     * @route   POST /api/tasks
     */
    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const creatorId = req.userID;
            const { id_groups } = req.body;
            if (!creatorId || !id_groups) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.create(req.body, creatorId, await this.groupService.getUserRoleInGroup(id_groups, creatorId));
            res.status(201).json(result);
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI TẠO TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };

    /**
     * @desc    Lấy danh sách task theo group và vai trò
     * @route   GET /api/groups/:groupId/tasks
     */
    public getTasksByGroup = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_groups } = req.params;
            const userId = req.userID;

            const result = await this.taskService.findTasksByGroupAndRole(id_groups, userId as string, await this.groupService.getUserRoleInGroup(id_groups));

            if (result.valid) {
                res.status(200).json(result);
            } else {
                // Thường là lỗi server nếu service trả về false ở đây
                res.status(500).json(result);
            }
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI LẤY TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };

    /**
     * @desc    Cập nhật trạng thái của task (tương đương claim/cancel)
     * @route   PATCH /api/tasks/:taskId/status
     */
    public updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;
            const { status } = req.body;

            if (!status) {
                res.status(400).json({ valid: false, message: "Thiếu trạng thái (status) mới." });
                return;
            }
            if (status === "pending") {

            }
            const result = await this.taskService.updateStatus(taskId, status);

            if (result.valid) {
                res.status(200).json(result);
            } else {
                // Lỗi không tìm thấy task (404) hoặc status không hợp lệ (400)
                res.status(result.message.includes('không hợp lệ') ? 400 : 404).json(result);
            }
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI CẬP NHẬT STATUS:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };

    /**
     * @desc    Gán task cho một người thực hiện
     * @route   PATCH /api/tasks/:taskId/assign
     */
    public assignTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;
            const { implementerId } = req.body;

            if (!implementerId) {
                res.status(400).json({ valid: false, message: "Thiếu ID người thực hiện (implementerId)." });
                return;
            }

            const result = await this.taskService.assignImplementer(taskId, implementerId);

            if (result.valid) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result); // Lỗi không tìm thấy task
            }
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI GÁN TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
}

// Xuất ra một instance duy nhất để sử dụng trong file route
export default new TaskController();