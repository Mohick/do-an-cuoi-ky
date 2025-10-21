



import { motion } from "framer-motion"
import { Link } from "react-router-dom"




const AlertFailseSignUp = ({ closeAlert }: {
    closeAlert: (valid: boolean) => void,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex justify-center items-center bg-white/50 z-50"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`w-[400px] p-4 space-y-2 max-w-[90%] rounded-md shadow-lg bg-red-50 border border-red-500 text-red-600  `}
            >
                <h2 className="font-bold">
                    Đăng ký Thất bại
                </h2>
                <p className="text-sm">
                    Có lỗi đang diện ra . Nếu bạn cảm thấy không hài lòng vui lòng gửi báo cáo lỗi cho chúng tôi 
                    <Link to="/contact" className="font-bold ml-1 bg-blue-50 text-blue-500 p-1">
                       tại đây
                    </Link>
                </p>

                <button
                    className={`mt-6 w-full py-2 rounded-md text-white cursor-pointer transition bg-red-600 hover:bg-red-700`}
                    onClick={() => closeAlert(false)}
                >
                    Tắt thông báo
                </button>
            </motion.div>
        </motion.div>

    )
}


export default AlertFailseSignUp