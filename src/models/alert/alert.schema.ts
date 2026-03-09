import mongoose, { Schema, Document, Model, Types } from "mongoose";

// ====================== INTERFACE ITEM ======================
export interface INotificationItem {
    _id?: Types.ObjectId;
    title: string;
    message: string;
    from?: Types.ObjectId | null;
    read?: boolean;
    readAt?: Date | null;
    createdAt?: Date;
}

// ====================== MAIN INTERFACE ======================
export interface INotification extends Document {
    user: Types.ObjectId;
    groupID?: Types.ObjectId | null;
    taskID?: Types.ObjectId | null;

    unreadCount: number;
    notifications: INotificationItem[];

    addNotification(data: INotificationItem): Promise<void>;
    markAsRead(notiId: string): Promise<void>;
    markAllRead(): Promise<void>;
    resetUnread(): Promise<void>;
}

// ====================== SCHEMAS ======================
const notificationItemSchema = new Schema<INotificationItem>({
    title: { type: String, required: true },
    message: { type: String, required: true },

    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

    read: {
        type: Boolean,
        default: false
    },

    readAt: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const notificationSchema = new Schema<INotification>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    groupID: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: false
    },

    taskID: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: false
    },

    unreadCount: {
        type: Number,
        default: 0
    },

    notifications: [notificationItemSchema]

}, { timestamps: true });

// ====================== METHODS ======================
notificationSchema.methods.addNotification = async function (data: INotificationItem): Promise<void> {
    this.notifications.unshift(data);

    if (!data.read) this.unreadCount++;

    await this.save();
};

notificationSchema.methods.markAsRead = async function (notiId: string): Promise<void> {
    const noti = this.notifications.id(notiId);

    if (noti && !noti.read) {
        noti.read = true;
        noti.readAt = new Date();
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        await this.save();
    }
};

notificationSchema.methods.markAllRead = async function (): Promise<void> {
    this.notifications.forEach((n: any) => {
        if (!n.read) {
            n.read = true;
            n.readAt = new Date();
        }
    });

    this.unreadCount = 0;
    await this.save();
};

notificationSchema.methods.resetUnread = async function (): Promise<void> {
    this.unreadCount = 0;
    await this.save();
};

// ====================== MODEL ======================
const Notification: Model<INotification> =
    mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
