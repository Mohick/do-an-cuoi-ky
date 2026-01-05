// File: pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircleTwoTone } from "@ant-design/icons";
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
    socket.on('new-group', (group) => {
      setGroup((prev) => ([group, ...prev]))
    })
    return () => {
      socket.off('new-group')
    }
  }, []);

  if (!valid) return <div>Loading...</div>;



  return (
    <div className="space-y-6 min-h-screen">
      <HeaderDashboard title="Trang Chủ">
        <Link to="create-group">
          <motion.button
            className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg shadow hover:bg-blue-700 transition"
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            Tạo Group
            <PlusCircleTwoTone className="ml-2" />
          </motion.button>
        </Link>
      </HeaderDashboard>

      <GroupSection
        items={group}

      />

      <Outlet />
    </div>
  );
};

type GroupSectionProps = {
  items: Group[];
};

const GroupSection: React.FC<GroupSectionProps> = ({ items }) => {


  return (
    <div className="group space-y-4">
      {items?.length ? (
        <>
          <div className="w-full grid grid-cols-12 gap-6">
            {items.map((item) => (
              <Items
                _id={item._id}
                key={item._id}
                image={item.image}
                creator={item.creator}
                deadline={item.deadline}
                projectName={item.projectName}
                createdAt={item.createdAt}
              />
            ))}
          </div>

        </>
      ) : (
        <div>
          <p className="text-gray-500 text-lg text-center">Không có group Nào !</p>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
