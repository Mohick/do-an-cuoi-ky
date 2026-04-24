import { updateAccountAPI } from "../../../api/user"








const handleUpdate = (data: {
    username: string;
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    image: FileList
}) => {
    console.log(data);
    
    updateAccountAPI(data)

}

export { handleUpdate }