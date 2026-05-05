import mongoose, { Types } from 'mongoose';
import type { ICreateTaskDTO, ITask } from './task.interfaces.ts';
import TaskModel from './task.schema.ts'; // Import Mongoose model của bạn

class TaskService {
    private taskModel = TaskModel;
    public async create(
        taskData: ICreateTaskDTO,
        creatorId: string,
        creatorRole: 'leader' | 'member' | 'confirmer' | ""
    ): Promise<{ valid: boolean; task?: ITask; message: string }> {
        try {
            // Logic kiểm tra quyền hạn
            if (creatorRole !== 'leader') {
                return { valid: false, message: 'Chỉ có leader mới được quyền tạo task.' };
            }
            const items: any = await this.taskModel.create({
                ...taskData,
                creator: creatorId,
            });
            items.populate('creator', 'username email avatar');

            return { valid: true, task: items, message: 'Tạo task thành công' };
        } catch (error: any) {
            console.error("LỖI KHI TẠO TASK:", error);
            return { valid: false, message: error.message || 'Lỗi database khi tạo task.' };
        }
    }
    findAllTaskByGroupId = async (groupId: string): Promise<{ valid: boolean; tasks: ITask[]; message: string }> => {
        try {
            const tasks = await this.taskModel.find({ id_group: groupId });
            return { valid: true, tasks: tasks, message: 'Lấy danh sách task thành công.' };
        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task.' };
        }
    }
    // chỉ user có trong list member mới lấy đc task
    public async getFullTaskAwaiting(groupId: string): Promise<{ valid: boolean; tasks: any; message: string }> {
        try {
            const tasks = await this.taskModel
                .find({
                    id_group: groupId,
                    status: "waiting"
                })
                .populate('creator', 'username')
                .populate('implementer', 'username')
                .populate('comments.user', 'username')
                .sort({ createdAt: 'desc' });
            return { valid: true, tasks, message: 'Lấy danh sách task đang chờ thành công.' };
        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK WAITING:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task đang chờ.' };
        }
    }

    public async getFullMyTasks(groupId: string, userId: string): Promise<{ valid: boolean; tasks: any; message: string }> {
        try {
            const tasks = await this.taskModel
                .find({
                    id_group: new Types.ObjectId(groupId),
                    implementer: new Types.ObjectId(userId),
                    status: "handling"
                })
                .populate('creator', 'username email avatar')
                .populate('implementer', 'username email avatar')
                .populate('comments.user', 'username')
                .populate('confirmer', 'username email avatar')
                .sort({ updatedAt: 'desc' });
            return { valid: true, tasks, message: 'Lấy danh sách task bạn đang xử lý thành công.' };
        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK HANDLING CỦA TÔI:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task đang xử lý.' };
        }
    }
    public async getListPendingTask(groupId: string): Promise<{ valid: boolean; tasks: any; message: string }> {
        try {
            const tasks = await this.taskModel
                .find({
                    id_group: new Types.ObjectId(groupId),
                    status: "pending"
                })
                .populate('creator', 'username email avatar')
                .populate('implementer', 'username email avatar')
                .populate('comments.user', 'username')
                .sort({ updatedAt: 'desc' });
            return { valid: true, tasks, message: 'Lấy danh sách task đang chờ duyệt.' };
        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK CONFIRM:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task chờ duyệt.' };
        }
    }
    public async getListCompleteTask(groupId: string): Promise<{ valid: boolean; tasks: any; message: string }> {
        try {
            const tasks = await this.taskModel
                .find({
                    id_group: new Types.ObjectId(groupId),
                    status: "completed"
                })
                .populate('creator', 'username email avatar')
                .populate('implementer', 'username email avatar')
                .populate('comments.user', 'username')
                .populate('confirmer', 'username email avatar')
                .sort({ updatedAt: 'desc' });
            return { valid: true, tasks, message: 'Lấy danh sách task đang chờ duyệt.' };
        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK CONFIRM:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task chờ duyệt.' };
        }
    }
    public async handlePendingTask(
        userId: string,
        taskId: string,
        payload: boolean,
        userRole: 'leader' | 'confirmer'
    ): Promise<{ valid: boolean; tasks: any; message: string }> {
        try {
            if (userRole === 'leader' || userRole === 'confirmer') {
                if (payload) {
                    this.taskModel.updateOne(
                        { _id: taskId },
                        { $set: { status: 'completed', confirmer: userId } }
                    )
                } else {
                    this.taskModel.updateOne(
                        { _id: taskId },
                        { $set: { status: 'handling' } }
                    )
                }
            }
            return { valid: true, tasks: [], message: 'Bạn không có quyền xem task đang chờ duyệt.' };

        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK PENDING:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task chờ duyệt.' };
        }
    }
    public delTask = async (taskId: string): Promise<{ valid: boolean; message: string }> => {
        try {
            await this.taskModel.deleteOne({ _id: taskId });
            return { valid: true, message: 'Xóa task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI XỐA TASK:", error);
            return { valid: false, message: 'Lỗi server khi xóa task.' };
        }
    }
    public claimtask = async (taskId: string, implementerId: string): Promise<{ valid: boolean; message: string, task?: any }> => {
        try {
            const task = await this.taskModel.findOneAndUpdate({ _id: taskId }, { implementer: implementerId, status: 'handling' });
            return { valid: true, message: 'Cap nhat task thanh cong', task };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public sendRequireVeryTask = async (taskId: string): Promise<{ valid: boolean; message: string, task?: any }> => {
        try {
            const task = await this.taskModel.findOneAndUpdate({ _id: taskId }, { status: 'pending' });
            return { valid: true, message: 'Cap nhat task thanh cong', task };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public completeTask = async (taskId: string, confirmerId: string): Promise<{ valid: boolean; message: string, task?: any }> => {
        try {
            const task = await this.taskModel.findOneAndUpdate({ _id: taskId }, { status: 'completed', confirmer: confirmerId });
            return { valid: true, message: 'Cap nhat task thanh cong', task };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public rollbackTask = async (taskId: string): Promise<{ valid: boolean; task?: any; message: string }> => {
        try {
            const task = await this.taskModel.findOneAndUpdate({ _id: taskId }, { status: 'pending' });
            return { valid: true, task: task, message: 'Cap nhat task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public rejectTask = async (taskId: string): Promise<{ valid: boolean; task?: any, message: string }> => {
        try {
            const task = await this.taskModel.findOneAndUpdate({ _id: taskId }, { status: 'handling', confirmer: undefined });
            return { valid: true, task: task, message: 'Cap nhat task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public cancelTask = async (taskId: string): Promise<{ valid: boolean; message: string, task?: any }> => {
        try {
            const task = await this.taskModel.findOneAndUpdate({ _id: taskId }, { status: 'waiting' });
            return { valid: true, message: 'Cap nhat task thanh cong', task };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public getInfoTask = async (id_group: string): Promise<{
        valid: boolean; message: string, lengthFullTask?: {
            fullSizeTasks: number,
            sizeTaskAwaiting: number,
            sizeTaskHandling: number,
            sizeTaskPending: number,
            sizeTaskCompleted: number
        }
    }> => {
        try {
            const task = await this.taskModel.find({ id_group: id_group })
            const lengthFullTask = {
                fullSizeTasks: task.length  || 0,
                sizeTaskAwaiting: task.filter((item: any) => item.status === 'waiting').length  || 0,
                sizeTaskHandling: task.filter((item: any) => item.status === 'handling').length  || 0,
                sizeTaskPending: task.filter((item: any) => item.status === 'pending').length  || 0,
                sizeTaskCompleted: task.filter((item: any) => item.status === 'completed').length  || 0
            }

            return { valid: true, message: 'Cap nhat task thanh cong', lengthFullTask };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
  

    public commentInTask = async (
        taskID: string,
        userID: string,
        comment: string
    ): Promise<{ valid: boolean; message: string, newComment?: any }> => {
        try {
            const objectIdUser = new mongoose.Types.ObjectId(userID);

            // 1. Dùng toán tử $push để chỉ cập nhật mảng comments (hiệu suất cao hơn)
            const updateResult = await this.taskModel.updateOne(
                { _id: taskID }, // Tìm kiếm Task theo ID
                {
                    $push: {
                        comments: {
                            user: objectIdUser,
                            message: comment,
                        }
                    }
                }
            );

            const task = await this.taskModel.findById(taskID);

            if (!task) {
                return { valid: false, message: "Không tìm thấy nhiệm vụ." };
            }
            const shouldAlert = task.implementer && (objectIdUser.toString() !== task.implementer.toString());

            task.comments.push({
                user: objectIdUser,
                message: comment,
                alert: shouldAlert
            });

            await task.populate('comments.user', 'username avatar');
            return { valid: true, message: "Thành công", newComment: task.comments[task.comments.length - 1] };

        } catch (error: any) {
            // Xử lý lỗi ObjectId không hợp lệ hoặc lỗi DB
            console.error("LỖI KHI BÌNH LUẬN TRONG TASK:", error);
            return { valid: false, message: 'Lỗi server khi bình luận trong task.' };
        }
    }
}

export default new TaskService();