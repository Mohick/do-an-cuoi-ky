import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, User, UserCheck, UserPlus, Search, UserRoundPlus } from "lucide-react";
import { findUserByEmailAPI } from "../../../api/user";
import { handleAddMember } from "./handle-add-member";

type UserType = {
  id: string | number;
  _id: string;
  email: string;
  username: string;
};

type SearchResult = {
  valid: boolean;
  user?: UserType;
  userInGroup?: boolean;
  message?: string;
};

const ModelsAddMember = () => {
  const { id_group } = useParams();
  const navigate = useNavigate();
  const backPage = `/group/${id_group}/setting`;
  const outletContext = useOutletContext() as any
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email.trim()) { setResult(null); setLoading(false); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      findUserByEmailAPI(email, id_group as string)
        .then((res: any) => setResult(res.data))
        .catch(() => setResult({ valid: false, message: "Không tìm thấy người dùng." }))
        .finally(() => setLoading(false));
    }, 800);
    return () => clearTimeout(timer);
  }, [email, id_group]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 0.68, 0, 1.1] }}
        className="relative w-full max-w-sm bg-app border border-primary/12 rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-dark to-primary" />

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-primary/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center justify-center">
              <UserRoundPlus size={14} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#f0f0f0]">Thêm thành viên</h2>
              <p className="text-[10px] text-white/25 mt-0.5">Tìm kiếm qua email</p>
            </div>
          </div>
          <button
            onClick={() => navigate(backPage)}
            className="w-7 h-7 rounded-full border border-primary/20 bg-primary/6 text-primary flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Input */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.1em] text-primary/55 mb-2">
              Email người dùng
            </label>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@email.com"
                autoFocus
                className="w-full bg-[#1c2840] border border-[rgba(255,255,255,0.07)] rounded-[10px]
                  pl-9 pr-4 py-[10px] text-[13px] text-[#e0e0e0] placeholder:text-white/20
                  outline-none focus:border-primary/35 focus:bg-[#1e2d47]
                  transition-colors duration-200"
              />
              {/* Spinner inside input */}
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary/15 border-t-primary"
                />
              )}
            </div>
          </div>

          {/* Results */}
          <div className="min-h-[72px]">
            <AnimatePresence mode="wait">
              {/* Empty state */}
              {!email && (
                <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[12px] text-white/20 italic text-center py-4">
                  Nhập email để tìm kiếm thành viên
                </motion.p>
              )}

              {/* Not found */}
              {!loading && email && result && !result.valid && (
                <motion.div key="notfound" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.12)] rounded-[10px] px-4 py-3 text-center">
                  <p className="text-[12px] text-red-400/70">
                    {result.message || "Không tìm thấy người dùng"}
                  </p>
                </motion.div>
              )}

              {/* Found */}
              {!loading && result?.valid && result.user && (
                <motion.div key="found" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.05)] rounded-[12px] px-4 py-3 flex items-center justify-between gap-3"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-primary/60" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#e0e0e0] truncate">{result.user.username}</p>
                      <p className="text-[11px] text-white/30 truncate">{result.user.email}</p>
                    </div>
                  </div>

                  {/* Action */}
                  <AnimatePresence mode="wait" initial={false}>
                    {result.userInGroup ? (
                      <motion.span
                        key="invited"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-1.5 text-[10px] font-medium text-primary/70
                          bg-primary/8 border border-primary/18
                          px-3 py-[5px] rounded-full flex-shrink-0"
                      >
                        <UserCheck size={11} /> Đã mời
                      </motion.span>
                    ) : (
                      <motion.button
                        key="invite"
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={async () => {
                          const ok = await handleAddMember({
                            id_group: id_group || "",
                            userID: result.user?._id || "",
                            email: result.user?.email || "",
                            groupName: "đẹp trai",
                            username: result.user?.username || "",
                          });
                          if (ok) setResult((prev) => prev ? { ...prev, userInGroup: true } : prev);
                          outletContext["activeMember"]['active']((prev: any) => [...prev, result.user]);

                        }}
                        className="flex items-center gap-1.5 text-[10px] font-medium text-green-400
                          bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]
                          px-3 py-[5px] rounded-full flex-shrink-0
                          hover:bg-[rgba(34,197,94,0.18)] transition-colors cursor-pointer"
                      >
                        <UserPlus size={11} /> Gửi lời mời
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelsAddMember;