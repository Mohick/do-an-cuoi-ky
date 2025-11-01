



export interface PropsCreateTask {
    task_name: string
    url?: string
    description?: string
    deadline: string
    id_group: string
}



// Interface cho đối tượng 'creator' lồng trong
export interface CreatorInfo {
    _id: string;
    username: string;
}

// Interface (placeholder) cho 'comments'
// Bạn nên định nghĩa rõ cấu trúc của một comment nếu có
export interface Comment {
    [key: string]: any; // Hoặc định nghĩa rõ các trường
}

// Interface PropsViewsTask đã được cập nhật
export interface PropsViewsTask {
    status: 'waiting' | 'handling' | 'done' | string;
    _id: string;
    task_name: string;
    creator: CreatorInfo; // Thay đổi từ string sang object
    url?: string;
    description?: string;
    deadline?: string; // Thay đổi từ Date sang string (để khớp JSON)
    id_group: string;
    comments: Comment[];
    implementer?: string; // Thay đổi thành optional
    Confirmer?: string;   // Thay đổi thành optional
    createdAt: string; // Thay đổi từ Date sang string (để khớp JSON)
    updatedAt: string; // Thay đổi từ Date sang string (để khớp JSON)
    __v?: number;
}


export interface Props_Role_Group {
    valid?: boolean
    Role: string
    message?: string
}

export interface PropsUpdateClaimTask {
    id_task: string,
    status: string
}