import { motion } from "framer-motion"
import LayoutApp from "../../layout"




export default function Achieve() {
  return (
    <div className="h-screen p-4 w-full flex justify-center items-center">
      <LayoutApp className="h-full items-center flex flex-col justify-center">
        
        {/* Border tổng với hiệu ứng gradient chạy vòng */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="p-[3px] rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{
            backgroundSize: "300% 300%",
            animation: "gradientMove 1s linear infinite",
          }}
        >
          <div className="max-w-[650px] w-full rounded-md bg-[#1a2233]">
            
            {/* Thanh trên */}
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.8 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 12,
                duration: 1,
              }}
              viewport={{ amount: 0.9, once: true }}
              className="p-5 rounded-t-md w-full bg-[#212e42] grid grid-cols-3 gap-4"
            >
              {["Chưa làm", "Đang làm", "Đã xong"].map((txt, i) => (
                <Items key={i} text={txt} />
              ))}
            </motion.div>

            {/* Thanh dưới */}
            <motion.div
              initial={{ height: 0, padding: 0, opacity: 0 }}
              whileInView={{
                height: "fit-content",
                padding: "20px",
                opacity: 1,
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ amount: 0.9, once: true }}
              className="bg-[#1f2937] rounded-b-md w-full flex justify-center items-center"
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.5, once: true }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15 } },
                }}
                className="mb-4 w-full grid text-center overflow-hidden text-white grid-cols-2 gap-4"
              >
                {[
                  { value: "10K+", label: "Người dùng" },
                  { value: "50K+", label: "Dự án" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "24/7", label: "Hỗ trợ" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 10,
                    }}
                    className="p-3 rounded-md bg-[#273549]"
                  >
                    <StatItem {...stat} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </LayoutApp>

      {/* CSS animation gradient */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}


function Items({ text }: { text: string }) {
    return (
        <div className="w-full space-y-3.5 h-full">
            <div>
                <h2 className="text-gray-100 text-xl text-nowrap text-center font-bold">{text}</h2>
            </div>
            <div className="flex p-5 rounded-md bg-gray-100/10 flex-col gap-2">
                <div className="h-2 w-full bg-gray-100/35"></div>
                <div className="h-2 max-w-2/3 bg-gray-100/35"></div>
            </div>
            <div className="flex p-5 rounded-md bg-gray-100/10 flex-col gap-2">
                <div className="h-2 w-full bg-gray-100/35"></div>
                <div className="h-2 max-w-2/3 bg-gray-100/35"></div>
            </div>

        </div>

    )
}

// StatItem.tsx
function StatItem({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    return (
        <div className="space-y-3">
            <h2 className="font-bold text-3xl md:4xl text-blue-400">{value}</h2>
            <p className="text-base">{label}</p>
        </div>
    );
}
