import HeaderDashboard from "../../../components/header";
import { ListMemberInGroups } from "./list-members";
import { motion } from "framer-motion";
import { Edit2, Trash2, LogOut, Settings } from "lucide-react";
import React from "react";
import { useRoleAccount } from "../../../hooks/role";
import { Link, useParams } from "react-router-dom";

interface GroupHeaderProps {
  groupName: string;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ groupName }) => {
  return (
    <Link to="edit-group" className="block">
      <div className="relative bg-[#141414] border border-primary/12 rounded-[14px] px-4 py-3 flex items-center justify-between overflow-hidden hover:border-primary/25 transition-colors group">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[14px] bg-gradient-to-r from-primary-dark to-primary" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-primary/8 border border-primary/15 flex items-center justify-center">
            <Settings size={14} className="text-primary" />
          </div>
          <h2 className="text-[14px] font-semibold text-[#f0f0f0]">{groupName}</h2>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[12px] font-medium px-3 py-[6px] rounded-[8px] transition-colors group-hover:bg-primary/16"
        >
          <Edit2 size={12} />
          Chỉnh sửa
        </motion.div>
      </div>
    </Link>
  );
};

const Setting = () => {
  const { listRole } = useRoleAccount();
  const { id_group } = useParams();
  const userRole = listRole?.[id_group || ""] || "leader";
  const isLeader = userRole === "leader";

  return (
    <div className="min-h-screen bg-app">
      <HeaderDashboard title="Cài đặt" />

      <div className="p-5 space-y-4">
        {/* Group header — chỉ leader */}
        {isLeader && <GroupHeader groupName="Tên nhóm của bạn" />}

        {/* Member list */}
        <ListMemberInGroups />

        {/* Danger zone */}
        <div className="bg-[#141414] border border-[rgba(239,68,68,0.12)] rounded-[14px] px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-medium text-red-400/80">
              {isLeader ? "Xóa nhóm" : "Rời nhóm"}
            </span>
            <span className="text-[11px] text-white/25">
              {isLeader
                ? "Hành động này không thể hoàn tác."
                : "Bạn sẽ không còn truy cập vào nhóm này."}
            </span>
          </div>

          <Link to={isLeader ? "delete" : "leave"}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-red-400 text-[12px] font-medium px-3 py-[6px] rounded-[8px] hover:bg-[rgba(239,68,68,0.18)] transition-colors cursor-pointer"
            >
              {isLeader ? <Trash2 size={12} /> : <LogOut size={12} />}
              {isLeader ? "Xóa group" : "Rời nhóm"}
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Setting;