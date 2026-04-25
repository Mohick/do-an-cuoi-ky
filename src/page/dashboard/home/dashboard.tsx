import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import HeaderDashboard from "../../../components/header";
import Items from "./items-page-dashboard";
import { getGroupAPI } from "../../../api/group";
import type { Group, PropsGetGroup } from "../../../api/props/group/props-get";
import { socket } from "../../../socket/socket.io";

const HomeDashboard = () => {
  const [group, setGroup] = useState<Group[]>([]);
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    getGroupAPI()
      .then((res: any) => {
        const data: PropsGetGroup = res.data ?? {};
        setGroup(data.groups);
        setValid(data.valid);
      })
      .catch((err) => console.log(err));

    socket.on("new-group", (g) => {
      setGroup((prev) => [g, ...prev]);
    });

    return () => { socket.off("new-group"); };
  }, []);

  if (!valid)
    return (
      <div className="min-h-screen bg-[#131b29] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border-2 border-[rgba(255,185,0,0.15)] border-t-[#ffb900]"
          />
          <span className="text-[12px] text-[rgba(255,185,0,0.4)] uppercase tracking-[0.12em]">
            Đang tải...
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#131b29]">
      <HeaderDashboard title="Trang Chủ">
        <Link to="create-group">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px]
              bg-[rgba(255,185,0,0.12)] border border-[rgba(255,185,0,0.25)]
              text-[#ffb900] text-[12px] font-medium cursor-pointer
              hover:bg-[rgba(255,185,0,0.18)] transition-colors"
          >
            <PlusCircleOutlined style={{ fontSize: 14 }} />
            Tạo Group
          </motion.button>
        </Link>
      </HeaderDashboard>

      <div className="p-5">
        <GroupSection items={group} />
      </div>

      <Outlet />
    </div>
  );
};

type GroupSectionProps = { items: Group[] };

const GroupSection: React.FC<GroupSectionProps> = ({ items }) => {
  if (!items?.length)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-[rgba(255,185,0,0.06)] border border-[rgba(255,185,0,0.12)] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,185,0,0.4)" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <p className="text-[13px] text-white/25 italic">Chưa có group nào.</p>
        <Link to="create-group">
          <span className="text-[12px] text-[#ffb900]/60 hover:text-[#ffb900] transition-colors underline underline-offset-2 cursor-pointer">
            Tạo group đầu tiên
          </span>
        </Link>
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-[#f0f0f0]">Danh sách nhóm</span>
        <span className="text-[11px] bg-[rgba(255,185,0,0.12)] text-[#ffb900] border border-[rgba(255,185,0,0.2)] rounded-full px-[9px] py-[2px]">
          {items.length}
        </span>
        <div className="flex-1 h-px bg-[rgba(255,185,0,0.08)]" />
      </div>

      <div className="w-full grid grid-cols-12 gap-4">
        {items.map((item, index) => (
          <Items
            key={item._id}
            indexItems={index}
            _id={item._id}
            image={item.image}
            creator={item.creator}
            deadline={item.deadline}
            projectName={item.projectName}
            createdAt={item.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeDashboard;