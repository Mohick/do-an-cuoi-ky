import { updateGroupAddMemberAPI } from "../../../api/group"









const handleAddMember = async (body: {
    id_group: string
    userID: string
    emai: string
    groupName: string
    username: string
}) => {
    try {
        updateGroupAddMemberAPI(body)
        return true
    } catch (error) {
        return false
    }
}

export { handleAddMember }