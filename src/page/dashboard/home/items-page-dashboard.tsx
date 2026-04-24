// File: components/Items.tsx
import React, { useState } from "react";
import { motion, type Variants, type MotionProps } from "framer-motion";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
export interface ItemsProps extends MotionProps {
  _id: string;
  indexItems: number;
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
  useState(() => {

  }, []);

  return (
    <motion.div
      key={_id}
      className={`item-${_id} col-span-3 w-full rounded-2xl border-white overflow-hidden shadow-md cursor-pointerborder from-[#8cd0fe] to-transparent`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      <Link to={`/group/${_id}`} className="grid grid-cols-12 h-full">
        <motion.div 
        initial={{ opacity: 0, x: 120,  }}
        animate={{ opacity: 1, x: 0 ,width: "100%"}}
        
        transition={{ duration: 0.5, delay: 0.2 * props.indexItems, ease: "easeOut" }}
        className="show_text w-full col-span-8 flex-1 h-full p-4 border border-8 origin-right rounded-l-2xl border-gray-200">
          <h3 className="text-lg font-bold truncate">{projectName}</h3>

          <p className="text-xs font-bold text-gray-400 mt-2 truncate">
            Deadline : {end}
          </p>
        </motion.div>
        <div className="col-span-4 h-full  flex  bg-white  items-center relative justify-center">
          <img src={image} alt={projectName} className="w-full max-h-[100px] h-fit object-cover rounded-full bg-white orverflow-hidden" />
          <div className="absolute  bg-gradient-to-r from-[#7c7c7c] to-transparent text-white w-full h-full"></div>
          <div className="  absolute bg-white right-full h-full  w-2">

          </div>
        </div>
      </Link>
    </motion.div >
  );
};

export default Items;
