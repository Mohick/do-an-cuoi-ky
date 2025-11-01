import type { Request, Response } from "express";
import TaskService from "../models/task/task.models";
import GroupService from "../models/group/group.models.ts";


class TaskController {

    private taskService = TaskService;
    private groupService = GroupService;
    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const creatorId = req.userID;
            const { id_group } = req.body;
            if (!creatorId || !id_group) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.create(req.body, creatorId, await this.groupService.getUserRoleInGroup(id_group, creatorId));
            res.status(201).json(result);
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI TẠO TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
    public GetTaskWaiting = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const result = await this.taskService.getFullTaskAwaiting(id_group);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI LẤY TASK WAITING:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
    public deleteTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { id_group } = req.query;
            const userId = req.userID;
            const isLeader = await this.groupService.getRoleGroup(id_group as string, userId as string);
            if (!isLeader) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.delTask(id);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI LẤY MY TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
    public claimTask = async (req: Request, res: Response) => {
        try {
            const userID = req.userID;
            const { id_task } = req.body;
            const memberInGroups = this.groupService.findGroupsByUserId(userID as string);
            if (!(await memberInGroups).valid) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.claimtask(id_task, userID as string);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public sendRequireVeryTask = async (req: Request, res: Response) => {
        try {
            const userID = req.userID;
            const { id_task, id_group } = req.body;
            const memberInGroups = await this.groupService.findGroupsByUserId(userID as string);
            if (!memberInGroups.valid) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.sendRequireVeryTask(id_task);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public completeTask = async (req: Request, res: Response) => {
        try {
            const userID = req.userID;
            const { id_task, id_group } = req.body;
            const memberInGroups = await this.groupService.getUserRoleInGroup(id_group, userID as string);
            if (!((memberInGroups) === "leader") && !((memberInGroups) === "confirmer")) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.completeTask(id_task, userID as string);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public rollbackTask = async (req: Request, res: Response) => {
        try {
            const userID = req.userID;
            const { id_task, id_group } = req.body;
            const memberInGroups = await this.groupService.getUserRoleInGroup(id_group, userID as string);
            if (!((memberInGroups) === "leader")) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.rollbackTask(id_task);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public rejectTask = async (req: Request, res: Response) => {
        try {
            const userID = req.userID;
            const { id_task, id_group } = req.body;
            const memberInGroups = await this.groupService.getUserRoleInGroup(id_group, userID as string);
            if (!((memberInGroups) === "leader") && !((memberInGroups) === "confirmer")) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.rejectTask(id_task);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public cancelTask = async (req: Request, res: Response) => {
        try {
            const userID = req.userID;
            const { id_task, id_group } = req.body;
            const memberInGroups = await this.groupService.findGroupsByUserId(userID as string);
            if (!memberInGroups.valid) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.cancelTask(id_task);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
}

export default new TaskController();