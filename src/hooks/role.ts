import { create } from 'zustand';

// 1. (Đã xóa) Interface 'Role' không cần thiết
// vì bạn đang lưu trữ trực tiếp string: string

// 2. Định nghĩa "khuôn mẫu" (interface) cho store
interface RoleStore {
  // --- State ---
  // Đã đổi: 'listRole' là một object với
  // key là string và value CŨNG là string.
  listRole: Record<string, string>; // hoặc { [key: string]: string }

  // --- Actions ---
  // Đã đổi: Hàm giờ nhận 2 tham số string, khớp với code của bạn
  addOrUpdateRole: (key: string, newRole: string) => void;
}

// 3. Khởi tạo store
export const useRoleAccount = create<RoleStore>((set) => ({

  // 4. Giá trị State ban đầu
  listRole: {}, // Đúng rồi, là object rỗng

  // 5. Định nghĩa Actions (Code của bạn đã đúng với interface mới)
  addOrUpdateRole: (key, newRole) => { // Không cần ghi 'string' nữa vì TS tự hiểu
    set((state) => ({
      listRole: {
        ...state.listRole,     // 1. Giữ lại tất cả các role cũ
        [key]: newRole         // 2. Thêm/cập nhật (key: string, value: string)
      }
    }));
  },
}));