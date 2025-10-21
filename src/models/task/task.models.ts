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
    public async getFullTaskstFullStatus(groupId: string, status: string): Promise<{ valid: boolean; tasks: any; message: string }> {
        try {
            const tasks = await this.taskModel
                .find({
                    id_group: new Types.ObjectId(groupId),
                    status // Sửa 'awaiting' thành 'waiting' cho đúng với schema
                })
                .populate('creator', 'name email avatar')
                .sort({ createdAt: 'desc' });

            return { valid: true, tasks, message: 'Lấy danh sách task đang chờ thành công.' };
        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK WAITING:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task đang chờ.' };
        }
    }
    // lấy ra các task của mình members {user, role}
    public async getFullMyTasks(groupId: string, userId: string): Promise<{ valid: boolean; tasks: any; message: string }> {
        try {
            const tasks = await this.taskModel
                .find({
                    id_group: new Types.ObjectId(groupId),
                    implementer: new Types.ObjectId(userId),
                })
                .populate('creator', 'name email avatar')
                .populate('implementer', 'name email avatar')
                .populate('confirmer', 'name email avatar')
                .sort({ updatedAt: 'desc' });

            return { valid: true, tasks, message: 'Lấy danh sách task bạn đang xử lý thành công.' };
        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK HANDLING CỦA TÔI:", error);
            return { valid: false, tasks: [], message: 'Lỗi server khi lấy task đang xử lý.' };
        }
    }
    // lấy ra các task đang chờ duyệt chỉ có admin và confirmer mới có thể duyệt
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
    // lấy ra các task của mình
    public async handleDelOrClaimTask(
        userId: string,
        taskId: string,
        payload: boolean,
        userRole: 'leader' | 'confirmer'
    ): Promise<{ valid: boolean; message: string }> {
        try {
            if (!payload) {
                if (userRole === 'leader') {
                    this.taskModel.deleteOne(
                        { _id: taskId }
                    )
                }
            }
            this.taskModel.updateOne(
                { _id: taskId },
                { $set: { implementer: userId } }
            )
            return { valid: true, message: 'Bạn không có quyền xem task đang chờ duyệt.' };

        } catch (error: any) {
            console.error("LỖI KHI LẤY TASK PENDING:", error);
            return { valid: false, message: 'Lỗi server khi lấy task chờ duyệt.' };
        }
    }
    public async handleToPending(taskId: string, userID: string): Promise<{ valid: boolean; message: string }> {
        try {
            this.taskModel.updateOne(
                { _id: taskId,implementer:userID},
                { $set: { status: 'pending' } }
            )
            return { valid: true, message: 'Tạo task thành cong' };
        } catch (error: any) {
            console.error("LỖI KHI XỐA TASK:", error);
            return { valid: false, message: 'Lỗi server khi xóa task.' };
        }
    }
    public async handleBackToPeding(taskId: string, userID: string): Promise<{ valid: boolean; message: string }> {
        try {
            this.taskModel.updateOne(
                { _id: taskId},
                { $set: { status: 'pending' } }
            )
            return { valid: true, message: 'Tạo task thành cong' };
        } catch (error: any) {
            console.error("LỖI KHI XỐA TASK:", error);
            return { valid: false, message: 'Lỗi server khi xóa task.' };
        }
    }
}
// ai cũng có thể thấy được cać task miễn là thành viên trong groups

export default new TaskService();