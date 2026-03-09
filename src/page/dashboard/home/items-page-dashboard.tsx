// File: components/Items.tsx
import React from "react";
import { motion, type Variants, type MotionProps } from "framer-motion";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export interface ItemsProps extends MotionProps {
  _id: string;
  image?: string;
  projectName?: string;
  creator?: {
    _id: string;
    username: string;
  };
  createdAt?: Date | string;
  deadline?: Date | string;
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
    transition: { duration: 0.25 },
  },
  tap: { scale: 0.98 },
};

const Items: React.FC<ItemsProps> = ({
  _id,
  image = "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  projectName = "Dự Án Phòng Không",
  creator = { _id: "", username: "Không rõ" },
  createdAt = "2023-01-01",
  deadline = "2023-01-01",
  ...props
}) => {
  const created = new Date(createdAt).toLocaleDateString();
  const end = new Date(deadline).toLocaleDateString();
  console.log(creator.username);
  
  return (
    <motion.div
      key={_id}
      className="col-span-3 w-full rounded-2xl overflow-hidden shadow-md cursor-pointer
        border border-transparent
        bg-gradient-to-br from-[#3b82f6] via-[#6366f1] to-[#8b5cf6]
        dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95]
        text-white"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      <Link to={`/group/${_id}`}>
        {/* IMAGE */}
        <div className="relative h-52 w-full group">
          <img
            src={image}
            alt={projectName}
            loading="lazy"
            className="w-full h-full object-cover opacity-80
              transition-transform duration-500 group-hover:scale-105"
          />

          {/* OVERLAY */}
          <motion.div
            className="absolute ml-2 mb-2 bottom-0 w-full text-xs capitalize space-y-2 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
          >
            {/* USER BUBBLE */}
            <motion.div
              className=" left-3 bottom-3 inline-flex items-center gap-2 px-3 py-1.5 
                text-xs rounded-lg shadow-md
                bg-gradient-to-r from-[#4f46e5]/80 to-[#7c3aed]/80 
                backdrop-blur-md"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
              <UserOutlined className="text-[0.8rem]" />
              <span className="truncate max-w-[10rem] font-light">
                {creator.username}
              </span>
            </motion.div>

            {/* DATE BOX */}
            <div
              className=" w-fit 
                px-2 py-1 rounded-md 
                bg-white/20 backdrop-blur-md text-white/90 shadow-sm"
            >
              ngày tạo: {created}
              <br />
              ngày kết thúc: {end}
            </div>
          </motion.div>
        </div>

        {/* CONTENT */}
        <div className="px-2 py-3">
          <motion.h3
            className="mb-1 text-base font-semibold tracking-tight text-white drop-shadow-sm"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
          >
            {projectName}
          </motion.h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default Items;
