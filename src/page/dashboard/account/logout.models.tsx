
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X, LogOut } from "lucide-react";

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.22, 0.68, 0, 1.1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-sm bg-app border border-primary/12 rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-dark to-primary" />

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-primary/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center justify-center">
              <LogOut size={14} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#f0f0f0]">Đăng xuất</h2>
              <p className="text-[10px] text-white/25 mt-0.5">Xác nhận đăng xuất</p>
            </div>
          </div>
          <Link to="/dashboard/account">
            <button className="w-7 h-7 rounded-full border border-primary/20 bg-primary/6 text-primary flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <X size={13} />
            </button>
          </Link>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[13px] text-[#e0e0e0] leading-relaxed text-center">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2 justify-end">
          <Link to="/dashboard/account">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-[7px] rounded-[9px] text-[12px] font-medium
                bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]
                text-white/40 hover:text-white/60 hover:border-[rgba(255,255,255,0.12)]
                transition-colors cursor-pointer"
            >
              Hủy
            </motion.button>
          </Link>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-[7px] rounded-[9px] text-[12px] font-semibold transition-all
              bg-primary/12 text-primary border border-primary/25 hover:bg-primary/20 cursor-pointer"
          >
            Đăng xuất
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Logout;