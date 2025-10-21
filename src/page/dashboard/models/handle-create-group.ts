import { createGroupAPI } from "../../../api/group"













const handleCreateGroup = async (items: any) => {
    const { user, projectName, endDate, image } = items    
    await createGroupAPI({ creator: user, name_project: projectName, deadline: endDate, image })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
}


export {
    handleCreateGroup
}