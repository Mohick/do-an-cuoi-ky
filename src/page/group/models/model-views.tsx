
import { motion } from "framer-motion";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  CloseOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  UserOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { PropsViewsTask } from "../../../api/props/task/create";
import { getItem } from "./hadle-views";
import {
  cancelTaskAPI,
  claimTaskAPI,
  completeTaskAPI,
  deleteTaskAPI,
  rejectTaskAPI,
  rollbackTaskAPI,
  sendRequireVeryTaskAPI,
  updateCancelTaskAPI,
  updateClaimTaskAPI,
} from "../../../api/task";
import { useRoleAccount } from "../../../hooks/role";
import { ComponentButton } from "../component/button-model-view";

const statusStyles: Record<string, string> = {
  waiting: "bg-gray-100 text-gray-700 border border-gray-300",
  handling: "bg-blue-100 text-blue-700 border border-blue-300",
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  completed: "bg-green-100 text-green-700 border border-green-300",
};

const FullViewsTask = () => {
  const listItems = useOutletContext<PropsViewsTask[]>();
  const { id_task, id_group } = useParams();
  const { listRole } = useRoleAccount();
  const navigate = useNavigate();
  const item = getItem(listItems, id_task as string) as PropsViewsTask;

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        ❌ Không tìm thấy công việc.
      </div>
    );
  }

  
  const statusKey = item.status as keyof typeof statusStyles;
  const hasImplementer = Boolean(item.implementer);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-semibold pr-10 break-words">
            {item.task_name}
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
          >
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Nội dung (Giữ nguyên) */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* ... (Tất cả JSX nội dung của bro ở đây) ... */}

          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-indigo-500" />
              <span>
                <span className="font-semibold">Người tạo:</span> {item.creator.username}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserOutlined className="text-green-500" />
              <span>
                <span className="font-semibold">Người nhận:</span>{" "}
                {item.implementer !== undefined ? item.implementer?.username : "Chưa có"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className="text-red-500" />
              <span>
                <span className="font-semibold">Deadline:</span>{" "}
                {new Date(`${item.deadline}`).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Trạng thái:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium ${statusStyles[statusKey]}`}
              >
                {statusKey.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageOutlined className="text-blue-500" />
              <span className="font-semibold text-gray-800">Mô tả:</span>
            </div>
            <div className="max-h-48 overflow-y-auto text-black bg-gray-50 rounded-xl p-3 text-sm leading-relaxed">
              {item.description || "Không có"}
            </div>
          </div>

          {/* Link */}
          <div className="flex items-start gap-2">
            <LinkOutlined className="text-blue-500 mt-1" />
            <div>
              <span className="font-semibold text-gray-800">Link File: </span>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline break-all"
                >
                  Bấm vào đây
                </a>
              ) : (
                "Không có"
              )}
            </div>
          </div>

          {/* Bình luận */}
          {hasImplementer && (
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <MessageOutlined /> Bình luận
              </h3>
              <input
                type="text"
                placeholder="Nhập bình luận..."
                className="border border-gray-300 rounded-lg w-full p-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>
          )}

        </div>
        <div className="border-t p-4 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
          {statusKey == "waiting" && <ComponentButton valid={true} onClick={() => {
            claimTaskAPI({ id_task: id_task || "" })
          }} name={"Nhận"} />} 
          {statusKey == "handling" && <>
            <ComponentButton valid={true} onClick={() => { sendRequireVeryTaskAPI({ id_task: id_task || "" }) }} name={"Hoàn thành"} />
            <ComponentButton valid={false} onClick={() => {cancelTaskAPI({ id_task: id_task || "", id_group: id_group || "" })}} name={"hủy"} />
          </>}
          {statusKey == "pending" && <>
            <ComponentButton valid={true} onClick={() => {completeTaskAPI({ id_task: id_task || "", id_group: id_group || "" })}} name={"Xác nhận"} />
            <ComponentButton valid={false} onClick={() => { rejectTaskAPI({ id_task: id_task || "", id_group: id_group || "" })}} name={"Từ chối"} />
          </>}
          {statusKey == "completed" && <>
            <ComponentButton valid={false} onClick={() => {rollbackTaskAPI({ id_task: id_task || "", id_group: id_group || "" })}} name={"hủy"} />
          </>}
          {
            listRole[id_group || ""] === "leader" &&
            <ComponentButton
              valid={false}
              onClick={() => deleteTaskAPI(id_task || "", id_group || "")}
              name="Xóa Task" // Đặt tên cho rõ
            />
          }
        </div>
      </motion.div>
    </div>
  );
};

export default FullViewsTask;