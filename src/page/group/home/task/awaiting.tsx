
import { Link, Outlet, useParams } from "react-router-dom"

import HeaderDashboard from "../../../../components/header"
import { motion } from "framer-motion"
import { PlusCircleOutlined } from "@ant-design/icons"
import ItemsGroup from "../../items"
import { useEffect, useState } from "react"
import { getListTaskAwaitingAPI } from "../../../../api/task"
import type { PropsViewsTask } from "../../../../api/props/task/create"
import { socket } from "../../../../socket/socket.io"
import { AlertComponent } from "../../../../components/alert/alert.componet"
import { useAlert } from "../../../../components/alert/alert.hook"
import { useRoleAccount } from "../../../../hooks/role"

const AwaitingTask = () => {
    const { id_group } = useParams();
    const [listTask, setListTask] = useState<PropsViewsTask[]>([])
    const { addAlert } = useAlert() as any
    const { listRole } = useRoleAccount()
    const [filterOptions, setFilterOptions] = useState({
        priority: "Tất cả", // Giá trị mặc định là "all"
    });
    useEffect(() => {
        const fetchTasks = async () => {
            if (!id_group) return; // Đảm bảo có id_group
            try {
                // Đặt await trực tiếp
                const res = await getListTaskAwaitingAPI(id_group) as any;
                // Đảm bảo kiểu dữ liệu, thay (res: any) bằng kiểu chính xác nếu có
                setListTask(res.data.tasks);
            } catch (error) {
                console.error("Lỗi khi tải danh sách nhiệm vụ:", error);
                addAlert({
                    title: "Lỗi",
                    message: "Không thể tải danh sách nhiệm vụ",
                    status: "error"
                });
            }
        };
        fetchTasks();

        socket.on("has-del-task", async (data: string) => {

            // Khi nhận được sự kiện "has-del-task", gọi lại API để lấy danh sách nhiệm vụ mới nhất
            try {
                setListTask((prev) => prev.filter((task) => task._id !== data));
                addAlert({
                    title: "Thành công",
                    message: "Nhiệm vụ đã được chuyển/xóa`",
                    status: "success"
                });
            } catch (error) {
                console.error("Lỗi khi tải danh sách nhiệm vụ:", error);
                addAlert({
                    title: "Lỗi",
                    message: "Không thể tải danh sách nhiệm vụ",
                    status: "error"
                });
            }
        });

        // 1. Lắng nghe thêm nhiệm vụ mới
        const handleAddTask = (task: PropsViewsTask) => {
            setListTask((prev) => [task, ...prev]);
            addAlert({
                title: "Thành công",
                message: "Có nhiệm vụ mới đã được thêm",
                status: "success"
            });
        };

        // 2. Lắng nghe xóa nhiệm vụ
        const handleRemoveTask = (taskID: string) => {
            setListTask((prev) => prev.filter((task) => task._id !== taskID));
            addAlert({
                title: "Thông báo",
                message: "Nhiệm vụ đã được chuyển/xóa",
                status: "success"
            });
        };

        socket.on("add-waiting-task", handleAddTask);
        socket.on("remove-waiting-task", handleRemoveTask);

        // Dọn dẹp: Tắt lắng nghe khi component unmount
        return () => {
            socket.off("add-waiting-task", handleAddTask);
            socket.off("remove-waiting-task", handleRemoveTask);
            socket.off("has-del-task");
        };
        // Thêm id_group, getListTaskAwaitingAPI và addAlert vào dependency array nếu chúng thay đổi
    }, [id_group, addAlert]);
  
    
    return (
        <div>
            <HeaderDashboard title="Nhiệm Vụ">

                <div className="flex gap-2 items-center">
                    <div className="gap-2 flex justify-center items-center">
                        <h3 className="text-xl">Filter : </h3>
                        <div className="flex gap-2 bg-white p-2 group rounded font-bold relative cursor-pointer text-black">
                            <p>Độ ưu tiên :</p>
                            <select onChange={(e) => setFilterOptions({ ...filterOptions, priority: e.target.value })}>

                                <option className="hover:bg-black/25 py-1" >Tất cả</option>
                                <option className="hover:bg-black/25 py-1" >Thấp</option>
                                <option className="hover:bg-black/25 py-1" >Trung bình</option>
                                <option className="hover:bg-black/25 py-1" >Cao</option>
                            </select>
                        </div>
                    </div>
                    {listRole[`${id_group}`] === 'leader' && <Link to="create">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircleOutlined className="w-5 h-5" />
                            Tạo Nhiệm Vụ
                        </motion.button>
                    </Link>}
                </div>
            </HeaderDashboard>
            <TaskSection listTask={listTask as PropsViewsTask[]} filterOptions={filterOptions} title="Nhiệm Vụ  đang chờ" />
            <Outlet context={listTask} />
            <AlertComponent />
        </div>
    )
}


export const TaskSection = ({ title, listTask, filterOptions }: { title: string, listTask: PropsViewsTask[], filterOptions: any }) => {


    // Kiểm tra xem listTask có tồn tại và có phần tử nào không
    const hasTasks = listTask && listTask.length > 0;

    
    return (
        <>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {
                        // Hiển thị danh sách tasks nếu có
                        hasTasks ? (
                            listTask.map((item: PropsViewsTask, index) => {
                            
                                
                                if (filterOptions.priority == "Tất cả") {
                                    return (
                                        <ItemsGroup
                                            index={index}
                                            key={item._id}
                                            item={item}
                                        />
                                    )
                                }else if (item.priority.toLowerCase() === filterOptions.priority.toLowerCase()) {
                                    return (
                                        <ItemsGroup
                                            index={index}
                                            key={item._id}
                                            item={item}
                                        />
                                    )
                                }
                            })
                        ) : (
                            // Hiển thị thông báo nếu không có items
                            <p className="text-gray-500 italic col-span-full">
                                Không có items nào trong mục này.
                            </p>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default AwaitingTask
