"use client" // Thêm use client nếu xài Next.js/React Server Components

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
import { getItem } from "./handle-views";
import {
  cancelTaskAPI, claimTaskAPI, completeTaskAPI, deleteTaskAPI,
  getCommentInTaskAPI, rejectTaskAPI, rollbackTaskAPI, sendRequireVeryTaskAPI,
} from "../../../api/task";
import { useRoleAccount } from "../../../hooks/role";
import { ComponentButton } from "../component/button-model-view";
import { useAccount } from "../../../hooks/account";
import { useEffect, useState } from "react";
import { socket } from "../../../socket/socket.io";
import { useForm } from "react-hook-form"; // <--- Import useForm

// 1. REGEX CHỐNG XSS DÙNG CHO COMMENT
const ANTI_XSS_REGEX = /^(?!(?:[\s\S]*<script|[\s\S]*javascript:|[\s\S]*on\w+=))[\s\S]*$/i;

// 2. TẠO TYPE CHO FORM COMMENT
type CommentFormType = {
  commentMsg: string;
};

const statusConfig: { [key: string]: { badge: string; label: string; bar: string } } = {
  waiting: { badge: "bg-[rgba(120,120,130,0.15)] text-[#aaa] border border-[rgba(130,130,140,0.2)]", label: "Chờ", bar: "from-[#555] to-[#888]" },
  handling: { badge: "bg-[rgba(59,130,246,0.12)] text-blue-400 border border-[rgba(59,130,246,0.2)]", label: "Đang xử lý", bar: "from-[#2563eb] to-[#60a5fa]" },
  pending: { badge: "bg-[rgba(255,185,0,0.12)] text-[#ffb900] border border-[rgba(255,185,0,0.22)]", label: "Pending", bar: "from-[#b37d00] to-[#ffb900]" },
  completed: { badge: "bg-[rgba(34,197,94,0.10)] text-green-400 border border-[rgba(34,197,94,0.2)]", label: "Hoàn thành", bar: "from-[#15803d] to-[#4ade80]" },
};

const InfoCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="bg-[#1a1a1a] border border-white/5 rounded-[10px] p-[10px_12px] flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-[0.08em] text-white/35">{label}</span>
    <div className="text-[13px] font-medium text-[#e0e0e0]">{children}</div>
  </div>
);

const FullViewsTask = () => {
  const listItems = useOutletContext<PropsViewsTask[]>();
  const { id_task, id_group } = useParams();
  const { listRole } = useRoleAccount();
  const navigate = useNavigate();
  const { data } = useAccount();
  const item = getItem(listItems, id_task as string) as PropsViewsTask;
  const [listComment, setListComment] = useState(item?.comments ?? []);

  // --- 3. KHỞI TẠO HOOK FORM ---
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<CommentFormType>({
    mode: "onChange"
  });

  useEffect(() => {
    socket.on("send-comment", (newComment: any) => {
      setListComment((prev: any) => [...prev, newComment]);
    });
    return () => { socket.off("send-comment"); };
  }, []);

  if (!item) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 text-white/50 text-sm">
          Không tìm thấy công việc.
        </div>
      </div>
    );
  }

  const statusKey = item.status as keyof typeof statusConfig;
  const cfg = statusConfig[statusKey] ?? statusConfig.waiting;
  const deadline = new Date(`${item.deadline}`).toLocaleString("vi-VN");

  // --- 4. HÀM XỬ LÝ SUBMIT COMMENT ---
  const onSubmitComment = (formData: CommentFormType) => {
    if (!formData.commentMsg.trim()) return; // Chặn gửi tin nhắn toàn dấu cách
    
    getCommentInTaskAPI({ 
      id_task: item._id, 
      comment: formData.commentMsg, 
      userID: data?.data.user._id || "", 
      id_group: id_group || "" 
    });
    
    reset(); // Clear input sau khi gửi
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 48, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 0.68, 0, 1.1] }}
        className="relative w-full max-w-3xl bg-[#111111] rounded-[18px] border border-[rgba(255,185,0,0.12)] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header (Giữ nguyên) */}
        <div className="relative bg-[#141414] border-b border-[rgba(255,185,0,0.1)] px-5 py-[18px] flex flex-col gap-2">
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.bar}`} />
          <h1 className="text-[16px] font-semibold text-[#f0f0f0] pr-9 leading-snug break-words">
            {item.task_name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-[0.08em] text-[rgba(255,185,0,0.55)]">Ưu tiên: {item.priority}</span>
            <span className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[10px] font-medium tracking-[0.1em] uppercase ${cfg.badge}`}>
              <span className="w-[5px] h-[5px] rounded-full bg-current opacity-70" /> {cfg.label}
            </span>
          </div>
          <button onClick={() => navigate(-1)} className="absolute top-[14px] right-4 w-7 h-7 rounded-full border border-[rgba(255,185,0,0.2)] bg-[rgba(255,185,0,0.06)] text-[#ffb900] flex items-center justify-center text-[13px] opacity-80 hover:opacity-100 transition-opacity">
            <CloseOutlined />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Info grid (Giữ nguyên) */}
          <div className="grid grid-cols-2 gap-[10px]">
            <InfoCard label="Người tạo"><span className="flex items-center gap-1.5"><UserOutlined className="text-[rgba(255,185,0,0.5)] text-[12px]" />{item.creator.username}</span></InfoCard>
            <InfoCard label="Người nhận"><span className="flex items-center gap-1.5"><UserOutlined className="text-green-500/60 text-[12px]" />{item.implementer?.username ?? "Chưa có"}</span></InfoCard>
            <InfoCard label="Deadline"><span className="flex items-center gap-1.5 text-[#ffb900]"><ClockCircleOutlined className="text-[12px]" />{deadline}</span></InfoCard>
            <InfoCard label="Trạng thái"><span className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[10px] font-medium tracking-[0.1em] uppercase ${cfg.badge}`}><span className="w-[5px] h-[5px] rounded-full bg-current opacity-70" />{cfg.label}</span></InfoCard>
          </div>

          {/* Mô tả & Link (Giữ nguyên) */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[rgba(255,185,0,0.55)] mb-2">Mô tả</p>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[10px] p-3 text-[13px] text-[#bbb] leading-relaxed max-h-[100px] overflow-y-auto">{item.description || "Không có"}</div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[rgba(255,185,0,0.55)] mb-2">Link file</p>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[10px] px-3 py-[10px] flex items-center gap-2 text-[12px]">
              <LinkOutlined className="text-blue-400 text-[12px]" />
              {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">Bấm vào đây</a> : <span className="text-white/25">Không có</span>}
            </div>
          </div>

          {/* Bình luận */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[rgba(255,185,0,0.55)] mb-2 flex items-center gap-1.5">
              <MessageOutlined className="text-[11px]" /> Bình luận
            </p>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-[10px] p-[10px] max-h-[140px] min-h-[80px] overflow-y-auto flex flex-col gap-[10px]">
              {listComment.length === 0 ? (
                <p className="text-[12px] text-white/25 text-center py-4">Chưa có bình luận nào.</p>
              ) : (
                listComment.map((cmt: any) => (
                  <div key={cmt._id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-[rgba(255,185,0,0.75)]">{cmt.user.username}</span>
                        {cmt.alert && <span className="text-[9px] font-bold text-red-400 bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.2)] px-[6px] py-[1px] rounded-full">NEW</span>}
                      </div>
                      <span className="text-[10px] text-white/25">{new Date(cmt.createdAt).toLocaleString("vi-VN")}</span>
                    </div>
                    <div className="bg-[#222] border border-white/[0.06] rounded-[0_8px_8px_8px] px-[10px] py-[7px] text-[12px] text-[#ccc] leading-relaxed max-w-[90%]">
                      {cmt.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* --- 5. TÍCH HỢP FORM VÀO INPUT COMMENT --- */}
            <form 
              onSubmit={handleSubmit(onSubmitComment)} 
              className="flex flex-col gap-1 mt-2"
            >
              <div className={`flex items-center gap-2 bg-[#1a1a1a] border rounded-[10px] px-[10px] py-[6px] transition-colors
                ${errors.commentMsg ? "border-red-500/50" : "border-[rgba(255,185,0,0.15)] focus-within:border-[rgba(255,185,0,0.4)]"}`}>
                
                <input
                  type="text"
                  placeholder="Nhập bình luận..."
                  {...register("commentMsg", {
                    required: "Vui lòng nhập nội dung",
                    validate: {
                      noXss: (value) => ANTI_XSS_REGEX.test(value) || "Phát hiện ký tự nguy hiểm!",
                      maxLength: (value) => value.length <= 1000 || "Bình luận tối đa 1000 ký tự"
                    }
                  })}
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#e0e0e0] placeholder:text-white/25"
                />
                
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all
                    ${isValid 
                      ? "bg-[rgba(255,185,0,0.12)] border border-[rgba(255,185,0,0.2)] text-[#ffb900] cursor-pointer hover:bg-[rgba(255,185,0,0.2)]" 
                      : "bg-white/5 text-white/20 cursor-not-allowed"}`}
                >
                  <SendOutlined style={{ fontSize: 12 }} />
                </button>
              </div>
              
              {/* Hiển thị lỗi nếu có */}
              {errors.commentMsg && (
                <span className="text-[10px] text-red-400/80 px-1">{errors.commentMsg.message}</span>
              )}
            </form>
          </div>
        </div>

        {/* Footer (Giữ nguyên) */}
        <div className="border-t border-white/[0.06] bg-[#0e0e0e] px-5 py-3 flex gap-2 justify-end flex-wrap">
          {statusKey === "waiting" && <ComponentButton page={statusKey} valid={true} onClick={() => claimTaskAPI({ id_task: id_task || "", id_group: id_group || "" })} name="Nhận" />}
          {statusKey === "handling" && <><ComponentButton page={statusKey} valid={true} onClick={() => sendRequireVeryTaskAPI({ id_task: id_task || "", id_group: id_group || "" })} name="Hoàn thành" /><ComponentButton page={statusKey} valid={false} onClick={() => cancelTaskAPI({ id_task: id_task || "", id_group: id_group || "" })} name="Hủy" /></>}
          {statusKey === "pending" && <>{(listRole[id_group || ""] === "leader" || listRole[id_group || ""] === "confirmer") && <ComponentButton page={statusKey} valid={true} onClick={() => completeTaskAPI({ id_task: id_task || "", id_group: id_group || "" })} name="Xác nhận" />}<ComponentButton page={statusKey} valid={false} onClick={() => rejectTaskAPI({ id_task: id_task || "", id_group: id_group || "" })} name="Từ chối" /></>}
          {statusKey === "completed" && <ComponentButton page={statusKey} valid={false} onClick={() => rollbackTaskAPI({ id_task: id_task || "", id_group: id_group || "" })} name="Hủy" />}
          {listRole[id_group || ""] === "leader" && <ComponentButton page={statusKey as string} valid={false} onClick={() => deleteTaskAPI(id_task || "", id_group || "")} name="Xóa Task" />}
        </div>
      </motion.div>
    </div>
  );
};

export default FullViewsTask;