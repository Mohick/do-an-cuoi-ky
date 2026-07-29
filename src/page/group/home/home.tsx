"use client";
import { motion } from "framer-motion";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import HeaderDashboard from "../../../components/header";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

const listItems = [
  {
    link: "/group/:id_group/waiting",
    title: "Nhiệm Vụ",
    sub: "Danh sách đang chờ",
    icon: <FileDoneOutlined />,
    bar: "from-[#2563eb] to-[#60a5fa]",
    badge: "bg-[rgba(59,130,246,0.12)] text-blue-400 border-[rgba(59,130,246,0.2)]",
    glow: "hover:shadow-[0_12px_32px_rgba(59,130,246,0.15)]",
    iconColor: "text-blue-400",
  },
  {
    link: "/group/:id_group/handling",
    title: "Đang Làm",
    sub: "Nhiệm vụ đang xử lý",
    icon: <ClockCircleOutlined />,
    bar: "from-primary-dark to-primary",
    badge: "bg-primary/12 text-primary border-primary/22",
    glow: "hover:shadow-[0_12px_32px_rgba(255,185,0,0.15)]",
    iconColor: "text-primary",
  },
  {
    link: "/group/:id_group/pending",
    title: "Đợi Duyệt",
    sub: "Chờ xác nhận",
    icon: <HourglassOutlined />,
    bar: "from-[#7c3aed] to-[#a78bfa]",
    badge: "bg-[rgba(139,92,246,0.12)] text-purple-400 border-[rgba(139,92,246,0.2)]",
    glow: "hover:shadow-[0_12px_32px_rgba(139,92,246,0.15)]",
    iconColor: "text-purple-400",
  },
  {
    link: "/group/:id_group/completed",
    title: "Hoàn Thành",
    sub: "Đã xong",
    icon: <CheckCircleOutlined />,
    bar: "from-[#15803d] to-[#4ade80]",
    badge: "bg-[rgba(34,197,94,0.10)] text-green-400 border-[rgba(34,197,94,0.2)]",
    glow: "hover:shadow-[0_12px_32px_rgba(34,197,94,0.15)]",
    iconColor: "text-green-400",
  },
];

const HomeTask = () => {
  const { id_group } = useParams();

  listItems.forEach((item) => {
    item.link = item.link.replace(":id_group", id_group || "");
  });

  useEffect(() => {
    return () => {
      listItems.forEach((item) => {
        item.link = item.link.replace(id_group || "", ":id_group");
      });
    };
  }, [id_group]);

  return (
    <div className="min-h-screen bg-app">
      <HeaderDashboard title="Trang Chủ Nhóm" />

      <div className="w-full mx-auto px-5 py-8">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] uppercase tracking-[0.15em] text-primary/50">
            Quản lý nhiệm vụ
          </span>
          <div className="flex-1 h-px bg-primary/8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {listItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to={item.link} className="block">
                <div
                  className={`
                    relative bg-[#141414] border border-[rgba(255,255,255,0.06)]
                    rounded-[16px] p-5 overflow-hidden cursor-pointer
                    transition-all duration-250
                    ${item.glow}
                    hover:border-[rgba(255,255,255,0.1)]
                  `}
                >
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-[16px] bg-gradient-to-r ${item.bar}`} />

                  {/* Inner sheen */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-[10px] flex items-center justify-center mb-4
                    bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]
                    text-[18px] ${item.iconColor}
                  `}>
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-[14px] font-semibold text-[#f0f0f0] leading-tight mb-1">
                    {item.title}
                  </h3>

                  {/* Sub */}
                  <p className="text-[11px] text-white/30">{item.sub}</p>

                  {/* Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTask;