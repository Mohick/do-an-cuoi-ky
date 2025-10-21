import { motion } from "framer-motion";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  UserOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { PropsTask } from "../../../api/props/task/create";
import { getItem } from "./hadle-views";
import { updateCancelTaskAPI, updateClaimTaskAPI } from "../../../api/task";

// 🎨 Màu đồng bộ cho badge status
const statusStyles: Record<string, string> = {
  waiting: "bg-gray-100 text-gray-700 border border-gray-300",
  handling: "bg-blue-100 text-blue-700 border border-blue-300",
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  completed: "bg-green-100 text-green-700 border border-green-300",
};

// 📝 Text cho action chính và phụ tương ứng với status
const statusActions: Record<
  string,
  { primary: string; secondary: string }
> = {
  waiting: { primary: "Nhận Task", secondary: "Xóa" },
  handling: { primary: "Trả Task", secondary: "Làm lại" },
  pending: { primary: "Xác nhận", secondary: "Làm lại" },
  completed: { primary: "Hoàn thành", secondary: "Xem xét lại" },
};

const FullViewsTask = () => {
  const listItems = useOutletContext<PropsTask[]>();
  const { id_task } = useParams();
  const navigate = useNavigate();
  const item = getItem(listItems, id_task as string) as PropsTask;

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

        {/* Nội dung */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-indigo-500" />
              <span>
                <span className="font-semibold">Người tạo:</span> {item.creator}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserOutlined className="text-green-500" />
              <span>
                <span className="font-semibold">Người nhận:</span>{" "}
                {item.implementer || "Chưa có"}
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

        {/* Footer nút hành động */}
        <div className="border-t p-4 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              updateClaimTaskAPI({ id_task: item._id, status: item.status })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium justify-center"
          >
            <CheckCircleOutlined />
            {statusActions[statusKey]?.primary || "Thao tác"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              updateCancelTaskAPI({ id_task: item._id, status: item.status })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium justify-center"
          >
            <DeleteOutlined />
            {statusActions[statusKey]?.secondary || "Hủy"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default FullViewsTask;
