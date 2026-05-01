import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Crown, Trash2, ShieldCheck, User, UserPlus, Clock } from "lucide-react";
import { Link, Outlet, useParams } from "react-router-dom";
import { useRoleAccount } from "../../../hooks/role";
import { useEffect, useState, type JSX } from "react";
import {
  getMemberHasJoinedGroupAPI, getMemberNotJoinedGroupAPI,
  updateChangeRoleConfirmerAPI, updateChangeRoleLeaderAPI,
  updateChangeRoleMemberAPI, updateKickMemberAPI,
} from "../../../api/group";

const listVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

interface Member {
  _id: string;
  username: string;
  avatar: string;
  role: "leader" | "member" | "confirmer";
  joined: boolean;
  email: string;
}

const roleConfig: Record<string, { label: string; badge: string; icon: JSX.Element }> = {
  leader: { label: "Trưởng nhóm", badge: "bg-[rgba(255,185,0,0.12)] text-[#ffb900] border border-[rgba(255,185,0,0.22)]", icon: <Crown size={11} className="text-[#ffb900]" /> },
  confirmer: { label: "Kiểm duyệt", badge: "bg-[rgba(34,197,94,0.10)] text-green-400 border border-[rgba(34,197,94,0.2)]", icon: <ShieldCheck size={11} className="text-green-400" /> },
  member: { label: "Thành viên", badge: "bg-[rgba(255,255,255,0.06)] text-white/40 border border-[rgba(255,255,255,0.08)]", icon: <User size={11} className="text-white/30" /> },
};

const ListMemberInGroups = () => {
  const { id_group } = useParams();
  const { listRole } = useRoleAccount();
  const [joinedMembers, setJoinedMembers] = useState<Member[]>([]);
  const [notJoinedMembers, setNotJoinedMembers] = useState<Member[]>([]);
  const userRole = listRole?.[id_group || ""] || "leader";
  const [overrideRole, setOverrideRole] = useState<Record<string, "leader" | "member" | "confirmer">>({});

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getMemberHasJoinedGroupAPI(id_group as string),
      getMemberNotJoinedGroupAPI(id_group as string),
    ]).then(([joinedRes, notJoinedRes]: any) => {
      if (!isMounted) return;
      const joined: Member[] = joinedRes.data?.members?.map((m: any) => {
        setOverrideRole((prev) => ({ ...prev, [m._id]: m.role }));
        return { _id: m.user._id, username: m.user.username, avatar: m.user.avatar, role: m.role, joined: true, email: m.user.email || "" };
      }) || [];
      const notJoined: Member[] = notJoinedRes.data?.members?.map((m: any) => ({
        _id: m.user._id, username: m.user.username, avatar: m.user.avatar, role: m.role, joined: false, email: m.user.email || "",
      })) || [];
      setJoinedMembers(joined);
      setNotJoinedMembers(notJoined);
    });
    return () => { isMounted = false; };
  }, [id_group]);

  const renderMemberItem = (item: Member) => {
    const effectiveRole = overrideRole[item._id] ?? item.role;
    const cfg = roleConfig[effectiveRole] ?? roleConfig.member;

    return (
      <motion.div
        key={item._id}
        variants={itemVariants}
        className="flex items-center justify-between bg-[#1a1a1a] border border-[rgba(255,255,255,0.05)] px-3 py-[10px] rounded-[10px] hover:border-[rgba(255,185,0,0.12)] transition-colors duration-200"
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={item.avatar}
              loading="lazy"
              className="w-8 h-8 rounded-full object-cover border border-[rgba(255,255,255,0.08)]"
              alt={item.username}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {effectiveRole === "leader" && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[rgba(255,185,0,0.15)] border border-[rgba(255,185,0,0.3)] flex items-center justify-center">
                <Crown size={8} className="text-[#ffb900]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-medium text-[#e0e0e0] truncate">{item.username}</span>
              <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-[7px] py-[2px] rounded-full uppercase tracking-[0.08em] ${cfg.badge}`}>
                {cfg.icon}{cfg.label}
              </span>
            </div>
            <p className="text-[11px] text-white/25 truncate mt-0.5">{item.email}</p>
          </div>
        </div>

        {/* Action menu — leader only, non-leader targets */}
        {userRole === "leader" && item.role !== "leader" && (
          <div className="relative group flex-shrink-0 ml-2">
            <div className="w-7 h-7 rounded-[7px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] flex items-center justify-center cursor-pointer hover:border-[rgba(255,185,0,0.2)] hover:bg-[rgba(255,185,0,0.05)] transition-colors">
              <MoreVertical size={14} className="text-white/30" />
            </div>
            <AnimatePresence>
              <motion.ul
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute hidden group-hover:block z-50 top-full right-0 mt-1 w-52
                  bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[12px]
                  shadow-[0_8px_24px_rgba(0,0,0,0.4)] p-1.5 space-y-0.5"
              >
                <li
                  onClick={() => { updateChangeRoleLeaderAPI({ id_group: id_group as string, userID: item._id }); setOverrideRole((p) => ({ ...p, [item._id]: "leader" })); }}
                  className="flex items-center gap-2 px-3 py-[7px] rounded-[8px] text-[12px] text-[#ffb900]/80 hover:bg-[rgba(255,185,0,0.08)] cursor-pointer transition-colors"
                >
                  <Crown size={13} className="text-[#ffb900]" /> Nhượng quyền leader
                </li>
                <li
                  onClick={() => { updateChangeRoleConfirmerAPI({ id_group: id_group as string, userID: item._id }); setOverrideRole((p) => ({ ...p, [item._id]: "confirmer" })); }}
                  className="flex items-center gap-2 px-3 py-[7px] rounded-[8px] text-[12px] text-green-400/80 hover:bg-[rgba(34,197,94,0.07)] cursor-pointer transition-colors"
                >
                  <ShieldCheck size={13} className="text-green-400" /> Người kiểm duyệt
                </li>
                <li
                  onClick={() => { updateChangeRoleMemberAPI({ id_group: id_group as string, userID: item._id }); setOverrideRole((p) => ({ ...p, [item._id]: "member" })); }}
                  className="flex items-center gap-2 px-3 py-[7px] rounded-[8px] text-[12px] text-white/40 hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors"
                >
                  <User size={13} className="text-white/30" /> Chỉ là thành viên
                </li>
                <div className="my-1 border-t border-[rgba(255,255,255,0.06)]" />
                <li
                  onClick={() => { updateKickMemberAPI({ id_group: id_group as string, userID: item._id }); }}
                  className="flex items-center gap-2 px-3 py-[7px] rounded-[8px] text-[12px] text-red-400/80 hover:bg-[rgba(239,68,68,0.08)] cursor-pointer transition-colors"
                >
                  <Trash2 size={13} className="text-red-400" /> Xóa thành viên
                </li>
              </motion.ul>
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  };

  const renderMemberList = (list: Member[], title: string, isPending = false) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#141414] border border-[rgba(255,255,255,0.05)] rounded-[14px] overflow-hidden"
    >
      {/* Accent bar */}
      <div className={`h-[2px] w-full ${isPending ? "bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]" : "bg-gradient-to-r from-[#b37d00] to-[#ffb900]"}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isPending
              ? <Clock size={13} className="text-purple-400/60" />
              : <User size={13} className="text-[rgba(255,185,0,0.5)]" />
            }
            <h3 className="text-[13px] font-medium text-[#f0f0f0]">{title}</h3>
            <span className={`text-[10px] px-[8px] py-[2px] rounded-full border
              ${isPending
                ? "bg-[rgba(139,92,246,0.1)] text-purple-400 border-[rgba(139,92,246,0.2)]"
                : "bg-[rgba(255,185,0,0.1)] text-[#ffb900] border-[rgba(255,185,0,0.2)]"
              }`}>
              {list.length}
            </span>
          </div>

          {userRole === "leader" && !isPending && (
            <Link to="add-member">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 bg-[rgba(255,185,0,0.1)] border border-[rgba(255,185,0,0.2)] text-[#ffb900] text-[11px] font-medium px-3 py-[5px] rounded-[8px] hover:bg-[rgba(255,185,0,0.16)] transition-colors cursor-pointer"
              >
                <UserPlus size={12} /> Thêm thành viên
              </motion.button>
            </Link>
          )}
        </div>

        <div className="h-px bg-[rgba(255,255,255,0.04)] mb-3" />

        {/* List */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-[6px] max-h-80 overflow-y-auto pr-1
            [&::-webkit-scrollbar]:w-[3px]
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[rgba(255,185,0,0.15)]
            [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {list.length
            ? list.map(renderMemberItem)
            : <p className="text-[12px] text-white/20 italic py-3 text-center">Hiện tại đang trống.</p>
          }
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {renderMemberList(joinedMembers, "Danh sách thành viên")}
      {renderMemberList(notJoinedMembers, "Đang đợi chấp nhận", true)}
      <Outlet />
    </div>
  );
};

export { ListMemberInGroups };