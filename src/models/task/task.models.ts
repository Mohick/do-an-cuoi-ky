import { Types } from 'mongoose';
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
            await this.taskModel.create({
                ...taskData,
                creator: creatorId,
            });
            return { valid: true, message: 'Tạo task thành công' };
        } catch (error: any) {
            console.error("LỖI KHI TẠO TASK:", error);
            return { valid: false, message: error.message || 'Lỗi database khi tạo task.' };
        }
    }

    // chỉ user có trong list member mới lấy đc task
    public async getFullTaskAwaiting(groupId: string): Promise<{ valid: boolean; tasks: any; message: string }> {
        try {
            const tasks = await this.taskModel
                .find({
                    id_group: new Types.ObjectId(groupId)
                })
                .populate('creator', 'username')
                .populate('implementer', 'username')
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
                })
                .populate('creator', 'username email avatar')
                .populate('implementer', 'username email avatar')
                .populate('confirmer', 'username email avatar')
                .sort({ updatedAt: 'desc' });
            return { valid: true, tasks, message: 'Lấy danh sách task bạn đang xử lý thành công.' };
        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK HANDLING CỦA TÔI:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task đang xử lý.' };
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
    public claimtask = async (taskId: string, implementerId: string): Promise<{ valid: boolean; message: string }> => {
        try {
            await this.taskModel.updateOne({ _id: taskId }, { implementer: implementerId, status: 'handling' });
            return { valid: true, message: 'Cap nhat task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public sendRequireVeryTask = async (taskId: string) => {
        try {
            await this.taskModel.updateOne({ _id: taskId }, { status: 'pending' });
            return { valid: true, message: 'Cap nhat task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public completeTask = async (taskId: string, confirmerId: string): Promise<{ valid: boolean; message: string }> => {
        try {
            await this.taskModel.updateOne({ _id: taskId }, { status: 'completed', confirmer: confirmerId });
            return { valid: true, message: 'Cap nhat task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public rollbackTask = async (taskId: string): Promise<{ valid: boolean; message: string }> => {
        try {
            await this.taskModel.updateOne({ _id: taskId }, { status: 'pending' });
            return { valid: true, message: 'Cap nhat task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public rejectTask = async (taskId: string): Promise<{ valid: boolean; message: string }> => {
        try {
            await this.taskModel.updateOne({ _id: taskId }, { status: 'handling', confirmer: undefined });
            return { valid: true, message: 'Cap nhat task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
    public cancelTask = async (taskId: string): Promise<{ valid: boolean; message: string }> => {
        try {
            await this.taskModel.updateOne({ _id: taskId }, { status: 'waiting' });
            return { valid: true, message: 'Cap nhat task thanh cong' };
        } catch (error: any) {
            console.error("LỖI KHI CẽP NHẤT TASK:", error);
            return { valid: false, message: 'Lỗi server khi cap nhat task.' };
        }
    }
}

export default new TaskService();