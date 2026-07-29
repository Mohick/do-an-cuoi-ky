import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, Users } from "lucide-react";
import { updateVerifyJoinGroupAPI } from "../../../api/group";
import { useNavigate } from "react-router-dom";

const JoinGroup = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const [groupId, setGroupId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyGroup = async () => {
      try {
        const queryURL = new URL(window.location.href);
        const { id_verify } = Object.fromEntries(queryURL.searchParams);

        if (!id_verify) {
          setStatus("error");
          setMessage("Thiếu mã xác nhận nhóm.");
          return;
        }

        const res = await updateVerifyJoinGroupAPI({ id_verify }) as any;

        if (res.data?.valid) {
          setStatus("success");
          setMessage("Xác nhận tham gia nhóm thành công!");
          setGroupId(res.data?.id_group ?? null);
        } else {
          setStatus("error");
          setMessage(res.data?.message || "Xác nhận tham gia nhóm thất bại.");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("Lỗi khi xác nhận nhóm, vui lòng thử lại sau.");
      }
    };

    verifyGroup();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1520] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 0.68, 0, 1.1] }}
        className="relative w-full max-w-sm bg-app border border-primary/12 rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${
          status === "loading" ? "bg-gradient-to-r from-primary-dark to-primary" :
          status === "success" ? "bg-gradient-to-r from-[#15803d] to-[#4ade80]" :
          "bg-gradient-to-r from-red-700 to-red-400"
        }`} />

        <div className="p-8 flex flex-col items-center gap-5 text-center">
          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="w-14 h-14 rounded-full border border-primary/15 bg-primary/6 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 rounded-full border-2 border-primary/15 border-t-primary"
                />
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#f0f0f0]">Đang xác nhận...</p>
                <p className="text-[12px] text-white/30 mt-1">Vui lòng chờ trong giây lát</p>
              </div>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-14 h-14 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center"
              >
                <CheckCircle size={26} className="text-green-400" />
              </motion.div>

              <div>
                <p className="text-[14px] font-semibold text-[#f0f0f0]">{message}</p>
                <p className="text-[12px] text-white/30 mt-1">Bạn đã là thành viên của nhóm</p>
              </div>

              <div className="flex flex-col gap-2 w-full">
                {groupId && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/group/${groupId}`)}
                    className="w-full flex items-center justify-center gap-2 py-[10px] rounded-[10px]
                      bg-primary/12 border border-primary/25
                      text-primary text-[13px] font-medium
                      hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Users size={14} />
                    Đến trang nhóm
                    <ArrowRight size={13} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-[9px] rounded-[10px]
                    bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]
                    text-white/40 text-[12px]
                    hover:text-white/60 hover:border-[rgba(255,255,255,0.12)]
                    transition-colors cursor-pointer"
                >
                  Về trang chủ
                </motion.button>
              </div>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-14 h-14 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center"
              >
                <XCircle size={26} className="text-red-400" />
              </motion.div>

              <div>
                <p className="text-[14px] font-semibold text-[#f0f0f0]">Xác nhận thất bại</p>
                <p className="text-[12px] text-red-400/60 mt-1">{message}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/dashboard")}
                className="w-full py-[10px] rounded-[10px]
                  bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]
                  text-white/40 text-[12px]
                  hover:text-white/60 hover:border-[rgba(255,255,255,0.12)]
                  transition-colors cursor-pointer"
              >
                Về trang chủ
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default JoinGroup;