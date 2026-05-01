import { CloseCircleOutlined, MenuOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const TitleDashboard = ({ text }: { text: string }) => {
  return (
    <h1 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[rgba(255,185,0,0.5)] px-2 mb-3">
      {text}
    </h1>
  );
};

const SideBarLayout = ({
  listSideBar,
  name,
}: {
  listSideBar: { name: string; link: string; icon: React.ReactNode }[];
  name: string;
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-[2px] flex lg:block justify-between items-center relative">
      <TitleDashboard text={name} />
      <div className="hidden lg:block">
        {listSideBar.map((item) => {
          const isActive =
            location.pathname.trim().toLowerCase() === item.link.trim().toLowerCase();

          return (
            <Link
              to={item.link}
              key={item.link}
              className={`
              group flex items-center gap-3 px-3 py-[9px] rounded-[10px]
              text-[13px] font-medium transition-all duration-200 relative overflow-hidden
              ${isActive
                  ? "bg-[rgba(255,185,0,0.1)] text-[#ffb900] border border-[rgba(255,185,0,0.18)]"
                  : "text-white/40 border border-transparent hover:bg-[rgba(255,255,255,0.04)] hover:text-white/70"
                }
            `}
            >
              {/* Active accent bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-[#ffb900] to-[rgba(255,185,0,0.3)]" />
              )}

              {/* Icon */}
              <span className={`flex-shrink-0 text-[15px] transition-colors duration-200 ${isActive ? "text-[#ffb900]" : "text-white/30 group-hover:text-white/50"}`}>
                {item.icon}
              </span>

              {/* Label */}
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
      {/* Nút mở Menu */}
      <div
        className="relative cursor-pointer lg:hidden hover:opacity-80 transition-opacity p-2"
        onClick={() => setIsOpen(true)}
      >
        <MenuOutlined className="text-white  text-xl" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <Models
            listSideBar={listSideBar}
            location={location.pathname.trim().toLowerCase()}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface Props {
  listSideBar: { name: string; link: string; icon: React.ReactNode }[];
  location: string;
  onClose: () => void;
}

const Models = ({ listSideBar, location, onClose }: Props) => {
  return (
    <>
      {/* Overlay - Lớp nền mờ phía sau */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed lg:hidden inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />

      {/* Drawer Content - Chạy từ phải qua */}
      <motion.div
        initial={{ x: "100%" }} // Bắt đầu ở ngoài màn hình bên phải
        animate={{ x: 0 }}      // Trượt vào vị trí cũ
        exit={{ x: "100%" }}    // Trượt ngược lại khi đóng
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-[#131b29] z-[70] shadow-2xl flex flex-col p-6"
      >
        {/* Nút Close */}
        <div className="flex justify-end mb-8">
          <button
            onClick={onClose}
            className="text-white/40 hover:text-[#ffb900] transition-colors"
          >
            <CloseCircleOutlined style={{ fontSize: '28px' }} />
          </button>
        </div>

        {/* Cân các Items ra giữa theo chiều dọc của Sidebar */}
        <div className="flex  flex-col gap-3 h-full">
          {listSideBar.map((item) => {
            const isActive = location === item.link.trim().toLowerCase();

            return (
              <Link
                to={item.link}
                key={item.link}
                onClick={onClose}
                className={`
                  group flex items-center gap-4 px-4 py-4 rounded-xl
                  text-[15px] font-medium transition-all duration-200
                  ${isActive
                    ? "bg-[rgba(255,185,0,0.1)] text-[#ffb900] border border-[rgba(255,185,0,0.18)]"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <span className={`text-xl ${isActive ? "text-[#ffb900]" : "text-white/20"}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default SideBarLayout;