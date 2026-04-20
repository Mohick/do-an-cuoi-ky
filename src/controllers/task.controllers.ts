import type { Request, Response } from "express";
import TaskService from "../models/task/task.models";
import GroupService from "../models/group/group.models.ts";
import { getIO } from "../third-party/socket/socket.ts";



class TaskController {

    private taskService = TaskService;
    private groupService = GroupService;
    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const creatorId = req.userID;
            const { id_group } = req.body;
            req.body.priority = req.body.priority ? req.body.priority.toLowerCase() : "thấp";
            if (!creatorId || !id_group) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            console.log(id_group);
            
            const result = await this.taskService.create(req.body, creatorId, await this.groupService.getUserRoleInGroup(id_group, creatorId));
            
            getIO().to(id_group).emit('add-waiting-task', result.task);
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
    public getFullMyTasks = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const userId = req.userID;
            const result = await this.taskService.getFullMyTasks(id_group, userId as string);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI LẤY MY TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public getListPendingTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const userID = req.userID;
            const memberInGroups = await this.groupService.getUserRoleInGroup(id_group, userID as string);
            if (memberInGroups !== "leader" && (memberInGroups !== "confirmer")) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.getListPendingTask(id_group);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI LẤY MY TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public getListCompleteTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_group } = req.params;
            const userID = req.userID;
            const memberInGroups = await this.groupService.getUserRoleInGroup(id_group, userID as string);
            if (memberInGroups !== "leader") {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }
            const result = await this.taskService.getListCompleteTask(id_group);
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI LẤY MY TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
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
            getIO().to(`${id_group}`).emit("has-del-task",`${id}`)
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI CONTROLLER KHI LẤY MY TASK:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    };
    public claimTask = async (req: Request, res: Response) => {
        try {
            const userID = req.userID;
            const { id_task, id_group } = req.body;
            const memberInGroups = this.groupService.getRoleGroup(id_group, userID as string);
            if (!(await memberInGroups).valid) {
                res.status(401).json({ valid: false, message: "Yêu cầu xác thực và cung cấp vai trò." });
                return;
            }

            const result = await this.taskService.claimtask(id_task, userID as string);
            if (result.valid) {
                getIO().to(id_group).emit('remove-waiting-task', id_task);
                getIO().to(id_group).emit('add-handling-task', result.task);
            }
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
            if (result.valid) {
                getIO().to(id_group).emit('remove-handling-task', id_task);
                getIO().to(id_group).emit('add-pending-task', result.task);
            }
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
            if (result.valid) {
                getIO().to(id_group).emit('add-completed-task', result.task);
                getIO().to(id_group).emit('remove-pending-task', id_task);
            }
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
            result.task.status = "pending";
            if (result.valid) {
                getIO().to(id_group).emit('add-pending-task', result.task);
                getIO().to(id_group).emit('remove-completed-task', id_task);
            }
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
            if (result.valid) {
                getIO().to(id_group).emit('add-handling-task', result.task);
                getIO().to(id_group).emit('remove-pending-task', id_task);
            }
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
            if (result.valid) {
                getIO().to(id_group).emit('add-waiting-task', result.task);
                getIO().to(id_group).emit('remove-handling-task', id_task);
            }
            res.status(result.valid ? 200 : 400).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
    public commentInTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userID, id_task, comment, id_group } = req.body;

            const result = await this.taskService.commentInTask(id_task, userID, comment);
            getIO().to(id_group).emit('send-comment', result.newComment);
           
            
            res.status(result.valid ? 201 : 400).json(result);
        } catch (error: any) {
            console.error("LỖI KHI LẤY GROUP:", error);
            res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
        }
    }
}

export default new TaskController();