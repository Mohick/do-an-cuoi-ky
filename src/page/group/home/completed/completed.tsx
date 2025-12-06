
import { Outlet, useOutletContext, useParams } from "react-router-dom"
import HeaderDashboard from "../../../../components/header"
import { TaskSection } from "../task/awaiting"
import { useEffect, useState } from "react"
import { getCompleteTaskAPI } from "../../../../api/task"
import { socket } from "../../../../socket/socket.io"
import type { PropsViewsTask } from "../../../../api/props/task/create"
import { useAlert } from "../../../../components/alert/alert.hook"
import { AlertComponent } from "../../../../components/alert/alert.componet"


const CompletedTask = () => {
    const { id_group } = useParams();
    const [listMyTask, setListTask] = useState<PropsViewsTask[]>()
    const { addAlert } = useAlert()

    useEffect(() => {
        getCompleteTaskAPI(id_group as string).then((res: any) => {
            setListTask(res.data.tasks)
        })
        socket.on("remove-completed-task", (idTask: string) => {
            setListTask((prev: PropsViewsTask[] | any) => prev.filter((task: PropsViewsTask) => task._id !== idTask))
            addAlert({
                title: "Thành công",
                message: "Xóa nhiệm vụ",
                status: "error"
            })
        })

        socket.on("add-completed-task", (task: PropsViewsTask) => {
            setListTask((prev: PropsViewsTask[] | any) => [...prev, task])
            addAlert({
                title: "Thành công",
                message: "Có nhiệm vụ newcom",
                status: "success"
            })
        })
    }, [])
    return (
        <div>
            <HeaderDashboard title="Nhiệm Vụ" />
            <TaskSection listTask={listMyTask as PropsViewsTask[]} title="Nhiệm Vụ  đang làm" />
            <Outlet context={listMyTask} />
            <AlertComponent/>
        </div>
    )
}




export default CompletedTask
