"use client";
import { motion } from "framer-motion";
import { CheckCircleOutlined, ClockCircleOutlined, FileDoneOutlined, HourglassOutlined } from "@ant-design/icons";
import HeaderDashboard from "../../../components/header";
import { Link, useOutletContext, useParams } from "react-router-dom";
import type { PropsGetListTask } from "../../../api/props/task/create";


const listItems = [
  {
    link: "/group/:id_group/awaiting",
    title: "Nhiệm Vụ",
    icon: <FileDoneOutlined className="text-blue-500 text-3xl" />,
    color: "from-blue-100 to-blue-200",
  },
  {
    link: "/group/:id_group/handling",
    title: "Đang Làm",
    icon: <ClockCircleOutlined className="text-yellow-500 text-3xl" />,
    color: "from-yellow-100 to-yellow-200",
  },
  {
    link: "/group/:id_group/pending",
    title: "Đợi Duyệt",
    icon: <HourglassOutlined className="text-purple-500 text-3xl" />,
    color: "from-purple-100 to-purple-200",
  },
  {
    link: "/group/:id_group/completed",
    title: "Đã Hoàn Thành",
    icon: <CheckCircleOutlined className="text-green-500 text-3xl" />,
    color: "from-green-100 to-green-200",
  },
];

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      type: "spring",
    },
  }),
};

const HomeTask = () => {

    const {id_group} = useParams()
    listItems.map((item) => {
        item.link = item.link.replace(':id_group', id_group || '')
        return item
    })
  return (
    <div className="min-h-screen">
      <HeaderDashboard title="Trang Chủ Nhóm Group" />
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {listItems.map((item, index) => (
          <motion.div
            key={item.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={item.link}>
              <div
                className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br ${item.color} shadow-sm hover:shadow-md transition`}
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-gray-800 font-semibold text-lg text-center">{item.title}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeTask;
