import { motion } from "framer-motion";
import { Loader2, LayoutDashboard } from "lucide-react";

const LoadingApp = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#131b29] z-50">
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        
        {/* Container cho Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center"
        >
          {/* Vòng xoay bao quanh icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute"
          >
            <Loader2 size={80} className="text-blue-500 opacity-20" />
          </motion.div>

          {/* Icon chính của Task Manager */}
          <LayoutDashboard size={40} className="text-blue-400" />
        </motion.div>

        {/* Chữ Loading với hiệu ứng nhịp thở */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-xl font-semibold tracking-widest uppercase"
          >
            Task Manager
          </motion.h2>
          
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-gray-400 text-sm mt-2"
          >
            Đang tải dữ liệu...
          </motion.p>
        </div>

        {/* Thanh progress giả cho "xịn" */}
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingApp;