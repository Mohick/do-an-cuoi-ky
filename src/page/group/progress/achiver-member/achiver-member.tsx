import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, CheckCircle, Crown, Mail, Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { getTopFiveMembersAPI } from "../../../../api/group";

interface TopMember {
  _id: string;
  username: string;
  email: string;
  totalTasksCompleted: number;
  role: "leader" | "member" | "confirmer" | string;
}

const roleConfig: Record<string, { label: string; badge: string; icon: string }> = {
  leader:    { label: "Leader",    badge: "bg-[rgba(255,185,0,0.12)] text-[#ffb900] border border-[rgba(255,185,0,0.25)]",       icon: "text-[#ffb900]" },
  confirmer: { label: "Xác nhận",  badge: "bg-[rgba(139,92,246,0.12)] text-purple-400 border border-[rgba(139,92,246,0.2)]",    icon: "text-purple-400" },
  member:    { label: "Thành viên",badge: "bg-[rgba(59,130,246,0.12)] text-blue-400 border border-[rgba(59,130,246,0.2)]",       icon: "text-blue-400" },
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1)
    return (
      <div className="w-6 h-6 rounded-full bg-[rgba(255,185,0,0.15)] border border-[rgba(255,185,0,0.3)] flex items-center justify-center">
        <Crown size={12} className="text-[#ffb900]" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="w-6 h-6 rounded-full bg-[rgba(148,163,184,0.12)] border border-[rgba(148,163,184,0.2)] flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-400">2</span>
      </div>
    );
  if (rank === 3)
    return (
      <div className="w-6 h-6 rounded-full bg-[rgba(180,120,60,0.12)] border border-[rgba(180,120,60,0.2)] flex items-center justify-center">
        <span className="text-[10px] font-bold text-amber-600">3</span>
      </div>
    );
  return (
    <div className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
      <span className="text-[10px] font-bold text-white/30">{rank}</span>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
};

export default function MemberTable() {
  const { id_group } = useParams();
  const [topMembers, setTopMembers] = useState<TopMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_group) { setError("Không tìm thấy ID nhóm."); setIsLoading(false); return; }
    const fetch = async () => {
      setIsLoading(true); setError(null);
      try {
        const res = await getTopFiveMembersAPI({ id_group }) as any;
        if (res.data.valid && Array.isArray(res.data.topMember)) {
          setTopMembers(res.data.topMember);
        } else {
          setError(res.data.message || "Không thể tải dữ liệu."); setTopMembers([]);
        }
      } catch { setError("Lỗi kết nối hoặc server."); setTopMembers([]); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, [id_group]);

  if (isLoading)
    return (
      <div className="w-full max-w-lg mx-auto bg-[#141414] border border-[rgba(255,185,0,0.1)] rounded-[16px] p-8 flex flex-col items-center justify-center gap-3 h-40">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-7 h-7 rounded-full border-2 border-[rgba(255,185,0,0.15)] border-t-[#ffb900]" />
        <p className="text-[12px] text-[rgba(255,185,0,0.4)] uppercase tracking-[0.12em]">Đang tải...</p>
      </div>
    );

  if (error)
    return (
      <div className="w-full max-w-lg mx-auto bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] rounded-[16px] p-6">
        <p className="text-red-400/80 text-[13px]">Lỗi: {error}</p>
      </div>
    );

  if (topMembers.length === 0)
    return (
      <div className="w-full max-w-lg mx-auto bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-[16px] p-8 text-center">
        <p className="text-white/25 text-[13px] italic">Chưa có thành viên nào hoàn thành task.</p>
      </div>
    );

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-[8px] bg-[rgba(255,185,0,0.1)] border border-[rgba(255,185,0,0.2)] flex items-center justify-center">
          <Crown size={13} className="text-[#ffb900]" />
        </div>
        <span className="text-[13px] font-medium text-[#f0f0f0]">
          Bảng xếp hạng
        </span>
        <span className="text-[11px] bg-[rgba(255,185,0,0.12)] text-[#ffb900] border border-[rgba(255,185,0,0.2)] rounded-full px-[9px] py-[2px]">
          Top {topMembers.length}
        </span>
        <div className="flex-1 h-px bg-[rgba(255,185,0,0.08)]" />
      </div>

      {/* List */}
      <motion.div
        className="flex flex-col gap-[8px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topMembers.map((m, index) => {
          const cfg = roleConfig[m.role?.toLowerCase()] ?? roleConfig.member;
          const isFirst = index === 0;

          return (
            <motion.div
              key={m._id}
              variants={itemVariants}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`
                relative bg-[#141414] rounded-[12px] px-4 py-3 overflow-hidden
                border transition-all duration-200 cursor-default
                ${isFirst
                  ? "border-[rgba(255,185,0,0.25)] shadow-[0_4px_20px_rgba(255,185,0,0.08)]"
                  : "border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)]"
                }
              `}
            >
              {/* Top accent for #1 */}
              {isFirst && (
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[12px] bg-gradient-to-r from-[#b37d00] to-[#ffb900]" />
              )}

              <div className="flex items-center justify-between gap-3">
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank */}
                  <RankBadge rank={index + 1} />

                  {/* Avatar */}
                  <div className={`
                    w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                    ${isFirst
                      ? "bg-[rgba(255,185,0,0.1)] border border-[rgba(255,185,0,0.2)]"
                      : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]"
                    }
                  `}>
                    <User size={15} className={isFirst ? "text-[#ffb900]" : "text-white/30"} />
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold text-[#f0f0f0] truncate">
                        {m.username}
                      </p>
                      <span className={`text-[9px] font-semibold px-[7px] py-[2px] rounded-full uppercase tracking-[0.08em] ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 flex items-center gap-1 mt-0.5 truncate">
                      <Mail size={10} />
                      {m.email}
                    </p>
                  </div>
                </div>

                {/* Right — stat */}
                <div className="flex-shrink-0 flex flex-col items-center bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] rounded-[8px] px-3 py-1.5 min-w-[60px]">
                  <span className="text-[16px] font-bold text-green-400 leading-tight">
                    {m.totalTasksCompleted}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <CheckCircle size={9} className="text-green-400/60" />
                    <span className="text-[9px] text-green-400/60 uppercase tracking-[0.06em]">done</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}