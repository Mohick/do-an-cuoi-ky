
import { motion } from "framer-motion";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  CloseOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  UserOutlined,
  LinkOutlined,
  SendOutlined,
} from "@ant-design/icons";
import type { PropsViewsTask } from "../../../api/props/task/create";
import { getItem } from "./hadle-views";
import {
  cancelTaskAPI,
  claimTaskAPI,
  completeTaskAPI,
  deleteTaskAPI,
  getCommentInTaskAPI,
  rejectTaskAPI,
  rollbackTaskAPI,
  sendRequireVeryTaskAPI,

} from "../../../api/task";
import { useRoleAccount } from "../../../hooks/role";
import { ComponentButton } from "../component/button-model-view";
import { useAccount } from "../../../hooks/account";
import { useEffect, useState } from "react";
import { socket } from "../../../socket/socket.io";


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
  const { data } = useAccount()
  const item = getItem(listItems, id_task as string) as PropsViewsTask;
  const [listComment, setListComment] = useState(item.comments);
  const [comment, setComment] = useState<string>("");
  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        ❌ Không tìm thấy công việc.
      </div>
    );
  }
  useEffect(() => {
    socket.on("send-comment", (newComment: any) => {
      setListComment((prev: any) => [...prev, newComment]);
    })
    return () => {
      socket.off("send-comment")
    }
  }, [])
  const statusKey = item.status as keyof typeof statusStyles;

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
            <br />
            <span className="text-xs text-indigo-200 font-normal">Độ ưu tiên: {item.priority}</span>
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
          <div className="flex text-black relative flex-col max-h-96 h-full"> {/* Loai bo max-h-96 va overflow-y-auto o day */}
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
              <MessageOutlined /> Bình luận
            </h3>

            <div className="flex flex-col max-h-96 min-h-[150px] overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50">
              {/* Kiểm tra nếu không có bình luận */}
              {listComment.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Chưa có bình luận nào.</p>
              ) : (
                listComment.map((comment) => (
                  <div
                    key={comment._id}
                    className="mb-4 relative flex flex-col"
                  >
                    {/* 1. Tiêu đề (Username và Thời gian) */}
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <UserOutlined className="text-indigo-500 text-sm" />
                        <span className="truncate">{comment.user.username}</span>

                        {/* Hiển thị 'New' (Nếu cần) */}
                        {comment.alert && (
                          <span className="ml-1 px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-100 rounded-full border border-red-300">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Thời gian (Đặt bên phải để dễ theo dõi) */}
                      <span className="text-gray-400 text-xs whitespace-nowrap">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* 2. Nội dung Bình luận (Dạng bong bóng) */}
                    <div className="relative bg-white p-3 rounded-xl shadow-sm border border-gray-100 max-w-[90%] break-words">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="sticky bg-white -bottom-6 flex items-center border border-gray-300 rounded-lg w-full p-1.5 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-500">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập bình luận..."
                className="w-full p-0.5 text-sm placeholder:text-gray-400 outline-none border-none focus:ring-0"
              />
              <button onClick={
                () => {
                  if (!comment) return

                  getCommentInTaskAPI({
                    id_task: item._id,
                    comment: comment,
                    userID: data?.data.user._id || "",
                    id_group: id_group || ""
                  })
                  setComment("")
                }
              } className="p-1 text-indigo-600 cursor-pointer hover:text-indigo-800 transition duration-150">
                <SendOutlined size={20} />
              </button>
            </div>
          </div>

        </div>
        <div className="border-t p-4 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
          {statusKey == "waiting" && <ComponentButton page={statusKey} valid={true} onClick={() => {
            claimTaskAPI({ id_task: id_task || "", id_group: id_group || "" })
          }} name={"Nhận"} />}
          {statusKey == "handling" && <>
            <ComponentButton page={statusKey} valid={true} onClick={() => { sendRequireVeryTaskAPI({ id_task: id_task || "", id_group: id_group || "" }) }} name={"Hoàn thành"} />
            <ComponentButton page={statusKey} valid={false} onClick={() => { cancelTaskAPI({ id_task: id_task || "", id_group: id_group || "" }) }} name={"hủy"} />
          </>}
          {statusKey == "pending" && <>
            {(listRole[id_group || ""] === "leader" || listRole[id_group || ""] === "confirmer") &&
              <ComponentButton page={statusKey} valid={true} onClick={() => { completeTaskAPI({ id_task: id_task || "", id_group: id_group || "" }) }} name={"Xác nhận"} />
            }
            <ComponentButton page={statusKey} valid={false} onClick={() => { rejectTaskAPI({ id_task: id_task || "", id_group: id_group || "" }) }} name={"Từ chối"} />
          </>}
          {statusKey == "completed" && <>
            <ComponentButton page={statusKey} valid={false} onClick={() => { rollbackTaskAPI({ id_task: id_task || "", id_group: id_group || "" }) }} name={"hủy"} />
          </>}
          {
            listRole[id_group || ""] === "leader" &&
            <ComponentButton page={statusKey}
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