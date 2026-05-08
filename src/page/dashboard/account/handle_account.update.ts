import type { NavigateFunction } from "react-router-dom";
import { updateAccountAPI } from "../../../api/user"








const handleUpdate = async (data: {
    username: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    image: FileList
}, navigate: NavigateFunction) => {

    try {
        await updateAccountAPI(data);
        navigate('/dashboard/account')
        return true

    } catch (error) {
        console.error("Lỗi khi cập nhật tài khoản:", error);
        return false
    }

}

export { handleUpdate }