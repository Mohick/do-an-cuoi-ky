import type { Types } from "mongoose";

// 1. Định nghĩa Interface cho các Object con (Sub-documents)
export interface IGroupMember {
    user: Types.ObjectId;
    role: 'leader' | 'member' | 'confirmer';
    joined: boolean;
    _id?: Types.ObjectId; // MongoDB tự tạo cho từng member
}

interface IGroupImage {
    url: string;
    public_id: string;
}

// 2. Interface chính kế thừa từ Document
// Đây là "Type của nó" mà bạn đang tìm
export interface IGroup extends Document {
    projectName: string;
    creator: Types.ObjectId;
    deadline: Date;
    image: IGroupImage;
    members: Types.DocumentArray<IGroupMember>; // Dùng DocumentArray để hỗ trợ các hàm của Mongoose như .id()
    createdAt: Date;
    updatedAt: Date;
    toObject: () => IGroup;
    save?: () => Promise<void> | undefined;
}