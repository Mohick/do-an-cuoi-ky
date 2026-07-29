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
  const [page, setPage] = useState<{ limit: number, page: number }>({ limit: 10, page: 1 });
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    getGroupAPI(page)
      .then((res: any) => {
        const data: PropsGetGroup = res.data ?? {};
        setGroup(group.concat(data.groups ?? []));
        setShowMore(data.hasMore ?? false);
      })
      .catch((err) => console.log(err));

    socket.on("new-group", (g) => {
      setGroup((prev) => [g, ...prev]);
    });

    return () => {
      socket.off("new-group");
    };
  }, [page]);

  console.log(group);
  
  return (
    <div className="min-h-screen bg-app">
      <HeaderDashboard title="Trang Chủ">
        <Link to="create-group">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px]
              bg-primary/12 border border-primary/25
              text-primary text-[12px] font-medium cursor-pointer
              hover:bg-primary/18 transition-colors"
          >
            <PlusCircleOutlined style={{ fontSize: 14 }} />
            Tạo Group
          </motion.button>
        </Link>
      </HeaderDashboard>

      <div className="py-5">
        <GroupSection items={group} setPage={setPage} showMore={showMore} />
      </div>

      <Outlet />
    </div>
  );
};

type GroupSectionProps = { items: Group[], setPage: React.Dispatch<React.SetStateAction<{ limit: number, page: number }>>, showMore: boolean };

const GroupSection: React.FC<GroupSectionProps> = ({ items, setPage, showMore }) => {
  if (!items?.length)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/6 border border-primary/12 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,185,0,0.4)" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p className="text-[13px] text-white/25 italic">Chưa có group nào.</p>
        <Link to="create-group">
          <span className="text-[12px] text-primary/60 hover:text-primary transition-colors underline underline-offset-2 cursor-pointer">
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
        <span className="text-[11px] bg-primary/12 text-primary border border-primary/20 rounded-full px-[9px] py-[2px]">
          {items.length}
        </span>
        <div className="flex-1 h-px bg-primary/8" />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  max-h-full overflow-y-auto gap-4">
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
      {showMore && <div className="flex justify-center mt-2">
        <button
          onClick={() => {
            if (!showMore) return;
            setPage((prev) => ({ limit: prev.limit, page: prev.page + 1 }));
          }}
          className="text-[12px] border py-1 px-5 rounded-4xl cursor-pointer hover:bg-primary  text-primary hover:text-white transition-colors">
          Xem thêm
        </button>
      </div>}
    </div>
  );
};

export default HomeDashboard;