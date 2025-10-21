
import { Outlet, useOutletContext, useParams } from "react-router-dom"
import type { PropsGetListTask, PropsTask } from "../../../../api/props/task/create"
import HeaderDashboard from "../../../../components/header"
import { TaskSection } from "../task/awaiting"


const PendingTask = () => {
    const outletContext = useOutletContext() as PropsGetListTask;
    return (
        <div>
            <HeaderDashboard title="Nhiệm Vụ"/>
            <TaskSection listTask={outletContext?.pendingTask as PropsTask[]} title="Nhiệm Vụ  đang làm" />
            <Outlet context={outletContext?.pendingTask} />
        </div>
    )
}




export default PendingTask
