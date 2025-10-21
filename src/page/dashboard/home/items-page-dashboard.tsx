// File: components/Items.jsx
import React from "react";
import { motion, type Variants } from "framer-motion";
import { CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

// Animation variants
const cardVariants: Variants = {
    initial: { opacity: 0, y: 12, scale: 0.97 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: "easeOut" as const },
    },
    hover: {
        y: -8,
        scale: 1.02,
        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
        transition: { duration: 0.25 },
    },
    tap: { scale: 0.98 },
};

const Items = ({
    image = "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    title = "Dự Án Phòng Không",
    creator = "Người thành lập",
    statusItems = "Đang Làm",
    id = "1",
    timeLine = {
        from: "2023-01-01",
        to: "2023-01-01"
    },
    ...props
}) => {
    return (
        <motion.div
            key={id}
            className="col-span-3 w-full rounded-2xl overflow-hidden shadow-md cursor-pointer
                 border border-gray-100 dark:border-gray-700 
                 bg-gradient-to-b from-white to-gray-50 
                 dark:from-gray-800 dark:to-gray-900"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            {...props}
        >
            {/* Image Section */}
            <Link to={`/group/${id}`}>
                <div className="relative h-52 w-full group">
                    <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* statusItems Badge */}
                    <motion.div
                        className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 text-xs font-medium 
                     rounded-full shadow-md border 
                     bg-green-50 text-green-700 border-green-200 
                     dark:bg-green-900/40 dark:text-green-300 capitalize dark:border-green-700"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                    >
                        <span className="flex items-center  justify-center w-5 h-5 rounded-full bg-green-500 text-white">
                            <CheckCircleOutlined />
                        </span>
                        {statusItems}
                    </motion.div>

                    {/* Subtitle Overlay */}
                    <motion.div
                        className="absolute left-3 bottom-3 flex items-center gap-2 px-3 py-1.5 text-xs 
                     text-white rounded-lg shadow-lg bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    >
                        <UserOutlined className="text-[0.8rem]" />
                        <span className="truncate max-w-[10rem] font-light">{creator}</span>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <motion.h3
                        className="mb-1 text-base font-semibold tracking-tight 
                     text-gray-900 dark:text-gray-100"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
                    >
                        {title}
                    </motion.h3>

                    <motion.p
                        className="text-xs capitalize text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                    >
                        ngày tạo: {new Date(timeLine.from).toLocaleDateString()}
                        <br />
                        ngày kết thúc: {new Date(timeLine.to).toLocaleDateString()}
                    </motion.p>
                </div>
            </Link>
        </motion.div>
    );
};

export default Items;
