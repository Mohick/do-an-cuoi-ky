



export interface PropsCreateTask {
    task_name: string
    url?: string
    description?: string
    deadline: string
    id_group: string
}


export type Comment = {
  user: string;     // ID của người comment
  message: string;          // Nội dung bình luận
  createdAt: Date;          // Thời điểm tạo bình luận
};

export interface PropsTask {
    status: 'waiting' | 'handling' | 'done' | string; // thêm union nếu có nhiều trạng thái cụ thể
    _id: string;
    task_name: string;
    creator: string;               // Hoặc string nếu liên kết với User
    url?: string;
    description?: string;
    deadline?: Date;
    id_group: string;      // Liên kết đến Group
    comments: Comment[];          // Danh sách bình luận
    implementer?: string | "";
    Confirmer?: string | "";
    createdAt: Date;
    updatedAt: Date;
    __v?: number;
}


export interface PropsGetListTask {
    valid: boolean
    waitingTask: PropsTask[],
    handlingTask: PropsTask[],
    pendingTask: PropsTask[],
    completedTask: PropsTask[]
    message: string
}

export interface PropsUpdateClaimTask {
    id_task: string,
    status: string
}