// src/interfaces/group.interface.ts (Bạn có thể tạo file riêng hoặc để chung)

import { Document, Schema } from 'mongoose';

// Interface cho một thành viên trong group
export interface IGroupMember {
    user: Schema.Types.ObjectId;
    role: 'leader' | 'member' | 'confirmer';
}

// Interface cho document Group (kế thừa từ Mongoose Document)
export interface IGroup extends Document {
    projectName: string;
    creator: Schema.Types.ObjectId;
    deadline: Date;
    image: {
        url: string;
        public_id: string;
    };
    members: IGroupMember[];
    status: 'working' | 'completed' | 'cancelled';
}

// Interface cho dữ liệu đầu vào khi tạo group (Data Transfer Object)
export interface ICreateGroupDTO {
    projectName: string;
    creator: string; // ID của người tạo
    deadline: Date;
    image: {
        url: string;
        public_id: string;
    };
}


export interface IMember {
    user: Schema.Types.ObjectId;
    role: 'leader' | 'member' | 'confirmer';
}