import type { PropsCreateTask } from "../../../api/props/task/create"
import { createTaskAPI } from "../../../api/task"









const handleCreateTask = (data: PropsCreateTask, id_group: string) => {
    data.id_group = id_group
    createTaskAPI(data)
}

export {
    handleCreateTask
}