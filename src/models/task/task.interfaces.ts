import { Document, Schema } from 'mongoose';

// Interface cho một comment trong task
export interface IComment extends Document {
    user: Schema.Types.ObjectId;
    alert: boolean;
    message: string;
    createdAt: Date;
}

export interface ITask extends Document {
    task_name: string;
    creator: Schema.Types.ObjectId;
    url?: string;
    description?: string;
    deadline?: Date;
    id_group: Schema.Types.ObjectId;
    comments: IComment[];
    implementer?: Schema.Types.ObjectId;
    confirmer?: Schema.Types.ObjectId;
    status: 'waiting' | 'handling' | 'pending' | 'completed';
}

// Interface cho dữ liệu đầu vào khi tạo Task (Data Transfer Object)
export interface ICreateTaskDTO {
    task_name: string;
    id_group: string;
    description?: string;
    deadline?: string | Date;
    implementer?: string; // ID của người thực hiện (nếu có)
}