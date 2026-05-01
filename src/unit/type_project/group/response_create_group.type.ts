import { Types } from 'mongoose';
import type { IGroup } from './schema.type';

// --- 1. Base Interfaces (Các cấu trúc dùng chung) ---
interface IBaseImage {
    url: string;
    public_id: string;
}

interface IBaseMember {
    role: "leader" | "member";
    joined: boolean;
}

// --- 2. Backend Document Types (Dùng cho Server/Database) ---
export interface IGroupImageDoc extends IBaseImage {
    _id?: Types.ObjectId;
}

export interface IGroupMemberDoc extends IBaseMember {
    user: Types.ObjectId;
    _id?: Types.ObjectId;
}

export interface IGroupDocument {
    _id: Types.ObjectId;
    projectName: string;
    creator: Types.ObjectId;
    deadline: Date;
    image: IGroupImageDoc;
    members: IGroupMemberDoc[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

// --- 3. Frontend Response Types (Dùng cho API/Client) ---
export interface ICloudinaryImage extends IBaseImage {
    _id?: string;
}

export interface ICreator {
    _id: string;
    username: string;
    email: string;
    avatar: ICloudinaryImage;
}

export interface IGroupMemberRes extends IBaseMember {
    user: string;
    _id: string;
}


// --- 4. Final API Response ---
export interface ICreateGroupResponse {
    valid: boolean;
    message: string;
    group?: IGroup;
}