import { Outlet, useParams } from "react-router-dom";
import HeaderDashboard from "../../../../components/header";
import { useEffect, useState } from "react";
import { getMyTaskAPI } from "../../../../api/task";
import { socket } from "../../../../socket/socket.io";
import type { PropsViewsTask } from "../../../../api/props/task/create";
import { useAlert } from "../../../../components/alert/alert.hook";
import { AlertComponent } from "../../../../components/alert/alert.componet";
import { TaskSection } from "../task/awaiting";

const HandlingTask = () => {
  const { id_group } = useParams();
  const [listMyTask, setListTask] = useState<PropsViewsTask[]>([]);
  const { addAlert } = useAlert() as any;
  const [filterOptions, setFilterOptions] = useState({ priority: "Tất cả" });

  useEffect(() => {
    getMyTaskAPI(id_group as string).then((res: any) => {
      setListTask(res.data.tasks);
    });

    socket.on("add-handling-task", (task: PropsViewsTask) => {
      setListTask((prev) => [task, ...prev]);
      addAlert({ title: "Thành công", message: "Nhiệm vụ đã được nhận", status: "success" });
    });

    socket.on("has-del-task", (data: string) => {
      setListTask((prev) => prev.filter((t) => t._id !== data));
      addAlert({ title: "Thành công", message: "Nhiệm vụ đã được chuyển/xóa", status: "success" });
    });

    socket.on("remove-handling-task", (idTask: string) => {
      setListTask((prev) => prev.filter((t) => t._id !== idTask));
      addAlert({ title: "Thông báo", message: "Nhiệm vụ đã được chuyển đi", status: "success" });
    });

    return () => {
      socket.off("has-del-task");
      socket.off("add-handling-task");
      socket.off("remove-handling-task");
    };
  }, [id_group]);

  return (
    <div className="min-h-screen bg-[#131b29]">
      <HeaderDashboard title="Nhiệm Vụ">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.1em] text-[rgba(255,185,0,0.55)]">
            Ưu tiên
          </span>
          <div className="relative">
            <select
              onChange={(e) => setFilterOptions({ ...filterOptions, priority: e.target.value })}
              className="appearance-none bg-[#1c2840] border border-[rgba(255,185,0,0.18)] rounded-[8px]
                text-[#e0e0e0] text-[12px] px-[10px] pr-7 py-[5px] outline-none cursor-pointer"
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
              <path d="M1 1l4 4 4-4" stroke="#ffb900" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </HeaderDashboard>

      <div className="p-5">
        <TaskSection
          listTask={listMyTask}
          filterOptions={filterOptions}
          title="Nhiệm vụ đang làm"
        />
      </div>

      <Outlet context={listMyTask} />
      <AlertComponent />
    </div>
  );
};

export default HandlingTask;