import { AlertTriangle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { patchLeaveGroupAPI } from "../../../api/group";
import { motion } from "framer-motion";
import { useState } from "react";

const ModelLeaveGroup = () => {
  const { id_group } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 0.68, 0, 1.1] }}
        className="relative bg-[#141414] border border-[rgba(239,68,68,0.15)] rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.5)] w-full max-w-sm overflow-hidden"
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-700 to-red-400" />

        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <h2 className="text-[15px] font-semibold text-[#f0f0f0]">Rời nhóm</h2>
          </div>

          {/* Body */}
          <p className="text-[13px] text-white/40 leading-relaxed mb-6">
            Bạn có chắc chắn muốn rời khỏi nhóm này?{" "}
            <span className="text-red-400/70">Hành động này không thể hoàn tác.</span>
          </p>

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <Link to={`/group/${id_group}/setting`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-[7px] rounded-[9px] text-[12px] font-medium
                  bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]
                  text-white/40 hover:text-white/60 hover:border-[rgba(255,255,255,0.12)]
                  transition-colors cursor-pointer"
              >
                Hủy
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await patchLeaveGroupAPI({ id_group: id_group as string });
                  navigate("/dashboard");
                } catch (err) {
                  console.error(err);
                  setLoading(false);
                }
              }}
              className={`px-4 py-[7px] rounded-[9px] text-[12px] font-medium
                bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)]
                text-red-400 hover:bg-[rgba(239,68,68,0.2)]
                transition-colors cursor-pointer
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Đang xử lý..." : "Rời nhóm"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelLeaveGroup;