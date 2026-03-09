
import { Outlet, useParams } from "react-router-dom"
import HeaderDashboard from "../../../../components/header"
import { useEffect, useState } from "react"
import { getMyTaskAPI } from "../../../../api/task"
import { socket } from "../../../../socket/socket.io"
import type { PropsViewsTask } from "../../../../api/props/task/create"
import { useAlert } from "../../../../components/alert/alert.hook"
import { AlertComponent } from "../../../../components/alert/alert.componet"
import { TaskSection } from "../task/awaiting"


const HandlingTask = () => {
    const { id_group } = useParams();
    const [listMyTask, setListTask] = useState<PropsViewsTask[]>([])
    const { addAlert } = useAlert() as any
    useEffect(() => {
        getMyTaskAPI(id_group as string).then((res: any) => {
            setListTask(res.data.tasks)
        })
        socket.on("add-handling-task", (task: PropsViewsTask) => {
            setListTask((prev: PropsViewsTask[]) => [...prev, task])
            addAlert({
                title: "Thành công",
                message: "Nhiệm Vụ Đã Được Hoàn Thành",
                status: "success"
            })
        })
        socket.on("remove-handling-task", (idTask: string) => {
            setListTask((prev: PropsViewsTask[]) => prev.filter((task: PropsViewsTask) => task._id !== idTask))
            addAlert({
                title: "Thành công",
                message: "Có người đã nhận nhiệm vụ",
                status: "success"
            })
        })
        return () => {
            socket.off("add-handling-task")
            socket.off("remove-handling-task")
        }
    }, [])
    console.log(listMyTask);
    
    return (
        <div>
            <HeaderDashboard title="Nhiệm Vụ" />
            <TaskSection listTask={listMyTask as PropsViewsTask[]} title="Nhiệm Vụ  đang làm" />
            <Outlet context={listMyTask} />
            <AlertComponent />

        </div>
    )
}




export default HandlingTask
