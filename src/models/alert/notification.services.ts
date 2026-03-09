
import { Types } from "mongoose";
import Notification from "./alert.schema";

class NotificationService {

    /** Lấy hoặc tạo mới hồ sơ notification của user */
    async getOrCreate(userId: string, groupID?: string, taskID?: string) {
        let doc = await Notification.findOne({ user: userId, groupID, taskID });

        if (!doc) {
            doc = await Notification.create({
                user: userId,
                groupID: groupID ?? null,
                taskID: taskID ?? null,
                unreadCount: 0,
                notifications: []
            });
        }

        return doc;
    }


    /** Gửi thông báo */
    async push(userId: string, data: {
        title: string;
        message: string;
        from?: string | null;
        groupID?: string;
        taskID?: string;
    }) {

        const doc = await this.getOrCreate(userId, data.groupID, data.taskID);

        await doc.addNotification({
            title: data.title,
            message: data.message,
            from: data.from ? new Types.ObjectId(data.from) : null,
            read: false,
            createdAt: new Date()
        });

        return doc;
    }


    /** Đánh dấu đã đọc */
    async markRead(userId: string, notiId: string) {
        const doc = await Notification.findOne({ user: userId });
        if (!doc) return null;

        await doc.markAsRead(notiId);
        return doc;
    }


    /** Đánh dấu tất cả là đã đọc */
    async markAll(userId: string) {
        const doc = await Notification.findOne({ user: userId });
        if (!doc) return null;

        await doc.markAllRead();
        return doc;
    }


    /** Reset số lượng chưa đọc (mở popup) */
    async reset(userId: string) {
        const doc = await Notification.findOne({ user: userId });
        if (!doc) return null;

        await doc.resetUnread();
        return doc;
    }
}

// Export instance cho bro chấm
export const NotificationServiceClass = new NotificationService();
