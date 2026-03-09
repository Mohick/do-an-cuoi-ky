import type {  PropsViewsTask } from "../../../api/props/task/create";






const getItem = (list: PropsViewsTask[], id: string): PropsViewsTask | {} => {
    if(list.length === 0) return {}
    return list.find(item => item._id === id) as PropsViewsTask
}

export {
    getItem
}