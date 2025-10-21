
import { Link, Outlet, useOutletContext, useParams } from "react-router-dom"
import type { PropsGetListTask, PropsTask } from "../../../../api/props/task/create"
import HeaderDashboard from "../../../../components/header"
import { motion } from "framer-motion"
import { PlusCircleOutlined } from "@ant-design/icons"
import ItemsGroup from "../../items"


const AwaitingTask = () => {
        const outletContext = useOutletContext() as PropsGetListTask;

    return (
        <div>
            <HeaderDashboard title="Nhiệm Vụ">
                <Link to="create">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <PlusCircleOutlined className="w-5 h-5" />
                        Tạo Nhiệm Vụ
                    </motion.button>
                </Link>
            </HeaderDashboard>
            <TaskSection listTask={outletContext?.waitingTask as PropsTask[]} title="Nhiệm Vụ  đang chờ" />
            <Outlet context={outletContext?.waitingTask} />
        </div>
    )
}


export const TaskSection = ({ title, listTask }: { title: string, listTask: PropsTask[] }) => {
    return (
        <>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {
                        listTask?.map((item: PropsTask,index) => {
                            return (
                                <ItemsGroup
                                    index={index}
                                    key={item._id}
                                    item={item}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default AwaitingTask
