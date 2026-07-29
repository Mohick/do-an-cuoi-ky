import { Link, Outlet, useParams } from "react-router-dom";
import HeaderDashboard from "../../../../components/header";
import { motion } from "framer-motion";
import { PlusCircleOutlined } from "@ant-design/icons";
import ItemsGroup from "../../items";
import { useEffect, useState } from "react";
import { getListTaskAwaitingAPI } from "../../../../api/task";
import type { PropsViewsTask } from "../../../../api/props/task/create";
import { socket } from "../../../../socket/socket.io";
import { AlertComponent } from "../../../../components/alert/alert.componet";
import { useAlert } from "../../../../components/alert/alert.hook";
import { useRoleAccount } from "../../../../hooks/role";

const AwaitingTask = () => {
  const { id_group } = useParams();
  const [listTask, setListTask] = useState<PropsViewsTask[]>([]);
  const { addAlert } = useAlert() as any;
  const { listRole } = useRoleAccount();
  const [filterOptions, setFilterOptions] = useState({ priority: "Tất cả" });

  useEffect(() => {
    const fetchTasks = async () => {
      if (!id_group) return;
      try {
        const res = await getListTaskAwaitingAPI(id_group) as any;
        setListTask(res.data.tasks);
      } catch {
        addAlert({ title: "Lỗi", message: "Không thể tải danh sách nhiệm vụ", status: "error" });
      }
    };
    fetchTasks();

    socket.on("has-del-task", (data: string) => {
      setListTask((prev) => prev.filter((t) => t._id !== data));
      addAlert({ title: "Thành công", message: "Nhiệm vụ đã được chuyển/xóa", status: "success" });
    });

    const handleAddTask = (task: PropsViewsTask) => {
      setListTask((prev) => [task, ...prev]);
      addAlert({ title: "Thành công", message: "Có nhiệm vụ mới đã được thêm", status: "success" });
    };
    const handleRemoveTask = (taskID: string) => {
      setListTask((prev) => prev.filter((t) => t._id !== taskID));
      addAlert({ title: "Thông báo", message: "Nhiệm vụ đã được chuyển/xóa", status: "success" });
    };

    socket.on("add-waiting-task", handleAddTask);
    socket.on("remove-waiting-task", handleRemoveTask);

    return () => {
      socket.off("add-waiting-task", handleAddTask);
      socket.off("remove-waiting-task", handleRemoveTask);
      socket.off("has-del-task");
    };
  }, [id_group, addAlert]);

  return (
    <div className="min-h-screen bg-app">
      <HeaderDashboard title="Nhiệm Vụ">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.1em] text-primary/55">
              Ưu tiên
            </span>
            <div className="relative">
              <select
                onChange={(e) => setFilterOptions({ ...filterOptions, priority: e.target.value })}
                className="appearance-none bg-[#1a1a1a] border border-primary/18 rounded-[8px] text-[#e0e0e0] text-[12px] px-[10px] pr-7 py-[5px] outline-none cursor-pointer"
              >
                <option>Tất cả</option>
                <option>Thấp</option>
                <option>Trung bình</option>
                <option>Cao</option>
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                width="10" height="6" viewBox="0 0 10 6" fill="none"
              >
                <path d="M1 1l4 4 4-4" stroke="#ffb900" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Tạo nhiệm vụ */}
          {listRole[`${id_group}`] === "leader" && (
            <Link to="create">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px]
                  bg-primary/12 border border-primary/25
                  text-primary text-[12px] font-medium cursor-pointer
                  hover:bg-primary/18 transition-colors"
              >
                <PlusCircleOutlined style={{ fontSize: 14 }} />
                Tạo Nhiệm Vụ
              </motion.button>
            </Link>
          )}
        </div>
      </HeaderDashboard>

      <div className="p-5">
        <TaskSection
          title="Nhiệm vụ đang chờ"
          listTask={listTask}
          filterOptions={filterOptions}
        />
      </div>

      <Outlet context={listTask} />
      <AlertComponent />
    </div>
  );
};

export const TaskSection = ({
  title,
  listTask,
  filterOptions,
}: {
  title: string;
  listTask: PropsViewsTask[];
  filterOptions: any;
}) => {
  const filtered =
    filterOptions.priority === "Tất cả"
      ? listTask
      : listTask.filter(
          (t) => t.priority.toLowerCase() === filterOptions.priority.toLowerCase()
        );

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-[13px] font-medium text-[#f0f0f0] whitespace-nowrap">{title}</h3>
        <span className="text-[11px] bg-primary/12 text-primary border border-primary/20 rounded-full px-[9px] py-[2px]">
          {filtered.length}
        </span>
        <div className="flex-1 h-px bg-primary/8" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {filtered.length > 0 ? (
          filtered.map((item, index) => (
            <ItemsGroup key={item._id} index={index} item={item} />
          ))
        ) : (
          <p className="text-[12px] text-white/20 italic col-span-full py-6">
            Không có nhiệm vụ nào trong mục này.
          </p>
        )}
      </div>
    </div>
  );
};

export default AwaitingTask;