import type { NavigateFunction } from "react-router-dom"
import { createGroupAPI } from "../../../api/group"













const handleCreateGroup = async (items: any, navigate: NavigateFunction, addAlert: any) => {
    try {
        const { user, projectName, endDate, image } = items
        await createGroupAPI({ creator: user, name_project: projectName, deadline: endDate, image })
            .then((res) => {
                addAlert({ type: 'success', message: 'Tạo nhóm mới thành công' });
                navigate('/dashboard')
            })
            .catch((err) => {
                addAlert({ type: 'error', message: err.response.data.message });
            })
       
    } catch (error) {

    }
}


export {
    handleCreateGroup
}