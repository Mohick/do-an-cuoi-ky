import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { PropsViewsTask } from "../../api/props/task/create";

type StatusCfg = {
  wrapper: string;
  badge: string;
  name: string;
  deadlineLabel: string;
  deadlineVal: string;
  bar: string;
  label: string;
  glow: string;
};

const statusConfig: { [key: string]: StatusCfg } = {
  waiting: {
    wrapper: "bg-[#141414] border border-[rgba(120,120,130,0.25)] shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
    bar: "from-[#555] to-[#888]",
    badge: "bg-[rgba(120,120,130,0.18)] text-[#aaa] border border-[rgba(150,150,160,0.2)]",
    name: "text-[#d0d0d0]",
    deadlineLabel: "text-[#666]",
    deadlineVal: "text-[#999]",
    label: "Chờ",
    glow: "hover:shadow-[0_12px_32px_rgba(100,100,100,0.18)]",
  },
  handling: {
    wrapper: "bg-[#141414] border border-[rgba(59,130,246,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
    bar: "from-[#2563eb] to-[#60a5fa]",
    badge: "bg-[rgba(59,130,246,0.12)] text-blue-400 border border-[rgba(59,130,246,0.2)]",
    name: "text-[#e0eaff]",
    deadlineLabel: "text-[#4a6fa5]",
    deadlineVal: "text-[#7db3ff]",
    label: "Đang xử lý",
    glow: "hover:shadow-[0_12px_32px_rgba(59,130,246,0.18)]",
  },
  pending: {
    wrapper: "bg-[#141414] border border-primary/20 shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
    bar: "from-primary-dark to-primary",
    badge: "bg-primary/12 text-primary border border-primary/22",
    name: "text-[#fff5d6]",
    deadlineLabel: "text-[#806000]",
    deadlineVal: "text-primary",
    label: "Pending",
    glow: "hover:shadow-[0_12px_32px_rgba(255,185,0,0.15)]",
  },
  completed: {
    wrapper: "bg-[#141414] border border-[rgba(34,197,94,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
    bar: "from-[#15803d] to-[#4ade80]",
    badge: "bg-[rgba(34,197,94,0.10)] text-green-400 border border-[rgba(34,197,94,0.2)]",
    name: "text-[#d1fae5]",
    deadlineLabel: "text-[#166534]",
    deadlineVal: "text-green-400",
    label: "Hoàn thành",
    glow: "hover:shadow-[0_12px_32px_rgba(34,197,94,0.15)]",
  },
};

const ItemsGroup = ({ item, index }: { item: PropsViewsTask; index: number }) => {
  const deadline = item.deadline
    ? `${new Date(item.deadline).getDate()}-${new Date(item.deadline).getMonth() + 1}-${new Date(item.deadline).getFullYear()}`
    : "Không có";

  const cfg = statusConfig[item.status] ?? statusConfig.waiting;

  return (
    <Link to={`views/${item._id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`relative rounded-[14px] p-[14px_16px] cursor-pointer overflow-hidden ${cfg.wrapper} ${cfg.glow} transition-shadow duration-250`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-[14px] bg-gradient-to-r ${cfg.bar}`} />

        {/* Inner sheen */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

        {/* Badge */}
        <span className={`inline-flex items-center gap-[5px] px-2 py-[2px] rounded-full text-[9px] font-semibold tracking-[0.12em] uppercase mb-[10px] ${cfg.badge}`}>
          <span className="w-[5px] h-[5px] rounded-full bg-current opacity-70" />
          {cfg.label}
        </span>

        {/* Task name */}
        <h3 className={`text-[13.5px] font-bold truncate whitespace-nowrap mb-2 leading-snug ${cfg.name}`}>
          {item.task_name}
        </h3>

        {/* Deadline */}
        <p className="flex items-center gap-1 text-[10px]">
          <span className={`font-medium ${cfg.deadlineLabel}`}>Deadline:</span>
          <span className={`font-semibold ${cfg.deadlineVal}`}>{deadline}</span>
        </p>
      </motion.div>
    </Link>
  );
};

export default ItemsGroup;