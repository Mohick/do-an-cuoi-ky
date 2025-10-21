
import { Outlet, useOutletContext, useParams } from "react-router-dom"
import type { PropsGetListTask, PropsTask } from "../../../../api/props/task/create"
import HeaderDashboard from "../../../../components/header"
import { TaskSection } from "../task/awaiting"


const HandlingTask = () => {
    const outletContext = useOutletContext() as PropsGetListTask;
    return (
        <div>
            <HeaderDashboard title="Nhiệm Vụ"/>
            <TaskSection listTask={outletContext?.handlingTask as PropsTask[]} title="Nhiệm Vụ  đang làm" />
            <Outlet context={outletContext?.handlingTask} />
        </div>
    )
}




export default HandlingTask
