
import { Outlet, useParams } from "react-router-dom"

import HeaderDashboard from "../../../../components/header"
import { TaskSection } from "../task/awaiting"
import { useEffect, useState } from "react"
import { getPendingTaskAPI } from "../../../../api/task"
import { socket } from "../../../../socket/socket.io"
import type { PropsViewsTask } from "../../../../api/props/task/create"
import { useAlert } from "../../../../components/alert/alert.hook"
import { AlertComponent } from "../../../../components/alert/alert.componet"


const PendingTask = () => {
    const { id_group } = useParams();
    const [listMyTask, setListTask] = useState<PropsViewsTask[]>()
    const { addAlert } = useAlert() as any
    useEffect(() => {
        getPendingTaskAPI(id_group as string).then((res: any) => {
            setListTask(res.data.tasks)
        })
        socket.on("remove-pending-task", (idTask: string) => {
            setListTask((prev: PropsViewsTask[] | any) => prev.filter((task: PropsViewsTask) => task._id !== idTask))
            addAlert({
                title: "Thành công",
                message: "Có nhiệm vụ mới đã được thêm",
                status: "success"
            });   
        })

        socket.on("add-pending-task", (task: string) => {
            setListTask((prev: PropsViewsTask[] | any) => [...prev, task])
            addAlert({
                title: "Thành công",
                message: "Có nhiệm vụ mới được thêm",
                status: "success"
            })
        })
        return () => {
            socket.off("remove-pending-task")
            socket.off("add-pending-task")
        }
    }, [])

    return (
        <div>
            <HeaderDashboard title="Nhiệm Vụ" />
            <TaskSection listTask={listMyTask as PropsViewsTask[]} title="Nhiệm Vụ  đang làm" />
            <Outlet context={listMyTask} />
            <AlertComponent />
        </div>
    )
}




export default PendingTask
