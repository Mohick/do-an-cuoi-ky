
import { Link, Outlet, useOutletContext, useParams } from "react-router-dom"

import HeaderDashboard from "../../../../components/header"
import { motion } from "framer-motion"
import { PlusCircleOutlined } from "@ant-design/icons"
import ItemsGroup from "../../items"
import { useEffect, useState } from "react"
import { getListTaskAwaitingAPI } from "../../../../api/task"
import type { PropsViewsTask } from "../../../../api/props/task/create"


const AwaitingTask = () => {
    const outletContext = useOutletContext() as string;
    const { id_group } = useParams();
    const [listTask, setListTask] = useState<PropsViewsTask[]>([])
    useEffect(() => {
        getListTaskAwaitingAPI(id_group as string).then((res: any) => {
            setListTask(res.data.tasks)
        })
    },[])
    return (
        <div>
            <HeaderDashboard title="Nhiệm Vụ">

                {outletContext === 'leader' && <Link to="create">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <PlusCircleOutlined className="w-5 h-5" />
                        Tạo Nhiệm Vụ
                    </motion.button>
                </Link>}
            </HeaderDashboard>
            <TaskSection listTask={listTask as PropsViewsTask[]} title="Nhiệm Vụ  đang chờ" />
            <Outlet context={listTask} />
        </div>
    )
}


export const TaskSection = ({ title, listTask }: { title: string, listTask: PropsViewsTask[] }) => {
    return (
        <>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {
                        listTask?.map((item: PropsViewsTask, index) => {
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
