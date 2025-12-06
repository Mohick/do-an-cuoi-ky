import type { PropsCreateTask } from "../../../api/props/task/create"
import { createTaskAPI } from "../../../api/task"









const handleCreateTask = async (data: PropsCreateTask, id_group: string) => {
    data.id_group = id_group
    await createTaskAPI(data)
}

export {
    handleCreateTask
}