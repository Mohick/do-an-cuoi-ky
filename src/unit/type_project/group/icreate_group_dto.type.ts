// Định nghĩa cấu trúc cho ảnh từ Cloudinary
interface IGroupImage {
    url: string;
    public_id: string;
}

// Interface chính cho DTO
export interface ICreateGroupDTO {
    projectName: string;
    creator: string; // Hoặc ObjectId nếu bạn dùng MongoDB
    deadline: Date;
    image: IGroupImage;
}