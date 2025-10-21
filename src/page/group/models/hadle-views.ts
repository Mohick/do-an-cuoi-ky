import type {  PropsTask } from "../../../api/props/task/create";






const getItem = (list: PropsTask[], id: string): PropsTask | {} => {
    if(list.length === 0) return {}
    return list.find(item => item._id === id) as PropsTask
}

export {
    getItem
}