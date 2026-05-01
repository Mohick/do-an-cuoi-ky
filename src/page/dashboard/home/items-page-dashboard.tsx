// File: components/Items.tsx
import React, { useRef, useEffect } from "react";
import { motion, type Variants, type MotionProps } from "framer-motion";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { CalendarDays } from "lucide-react";

export interface ItemsProps extends MotionProps {
  _id: string;
  indexItems: number;
  image?: string;
  projectName?: string;
  creator?: { _id: string; username: string };
  createdAt?: Date | string;
  deadline?: Date | string;
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  hover: {
    y: -6, scale: 1.025,
    transition: { duration: 0.25, ease: [0.22, 0.68, 0, 1.2] },
  },
  tap: { scale: 0.98 },
};

const Items: React.FC<ItemsProps> = ({
  _id,
  indexItems,
  image = "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  projectName = "Dự Án Phòng Không",
  creator = { _id: "", username: "Không rõ" },
  createdAt = "2023-01-01",
  deadline = "2023-01-01",
  ...props
}) => {
  const end = new Date(deadline).toLocaleDateString("vi-VN");
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP shimmer on mount per card
    gsap.fromTo(
      shimmerRef.current,
      { x: "-100%", opacity: 0 },
      {
        x: "200%", opacity: 1,
        duration: 0.7,
        delay: 0.2 * indexItems + 0.3,
        ease: "power2.out",
      }
    );
  }, [indexItems]);

  return (
    <motion.div
      key={_id}
      className={`item-${_id}w-full rounded-2xl overflow-hidden cursor-pointer relative
        bg-[#111111] border border-[#ffb900]/10
        shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,185,0,0.06)]`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      style={{ willChange: "transform" }}
      {...(props as MotionProps)}
    >
      {/* Shimmer sweep */}
      <div
        ref={shimmerRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,185,0,0.05), transparent)",
          width: "50%",
        }}
      />

      {/* Hover glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{ border: "1px solid rgba(255,185,0,0)" }}
        whileHover={{ borderColor: "rgba(255,185,0,0.35)" }}
        transition={{ duration: 0.3 }}
      />

      <Link to={`/group/${_id}`} className="grid grid-cols-12 h-full no-underline">
        {/* LEFT: text content */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.18 * indexItems, ease: "easeOut" }}
          className="col-span-8 flex flex-col justify-center p-4 relative border-r border-[#ffb900]/8"
        >
          {/* Accent bar */}
          <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-sm bg-gradient-to-b from-[#ffb900] to-[#ffb900]/10" />

          <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#ffb900]/70 mb-1 pl-2">
            Project
          </span>

          <h3 className="text-[15px] font-bold truncate text-white/90 pl-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            {projectName}
          </h3>

          <div className="flex items-center gap-1.5 mt-2 pl-2">
            <CalendarDays size={11} className="text-[#ffb900]/50 flex-shrink-0" />
            <p className="text-[10.5px] text-white/35">
              Deadline:{" "}
              <span className="text-[#ffb900]/70 font-medium">{end}</span>
            </p>
          </div>
        </motion.div>

        {/* RIGHT: image */}
        <div className="col-span-4 h-full relative overflow-hidden">
          <motion.img
            src={image}
            alt={projectName}
            loading="lazy"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, filter: "brightness(0.6) saturate(0.8)" }}
            animate={{ scale: 1, filter: "brightness(0.7) saturate(0.9)" }}
            whileHover={{ scale: 1.06, filter: "brightness(0.85) saturate(1.1)" }}
            transition={{ duration: 0.4 }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffb900]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
    </motion.div>
  );
};

export default Items;