import { motion } from "framer-motion"




const AlertSuccessSignUp = ({ closeAlert }: {
    closeAlert: (valid: boolean) => void,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed left-0 top-0 right-0 bottom-0 min-h-screen flex justify-center items-center bg-white/50 z-50"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`w-[400px] p-4 space-y-2 max-w-[90%] rounded-md shadow-lg bg-green-50 border border-green-500 text-green-600  `}
            >
                <h2 className="font-bold">
                    Đăng ký thành công
                </h2>
                <p className="text-sm">
                    Chúc mừng bạn đã đăng ký tạo tài khoản thành công !
                </p>

                <button
                    className={`mt-6 w-full py-2 rounded-md text-white cursor-pointer transition bg-green-600 hover:bg-green-700`}
                    onClick={() => closeAlert(false)}
                >
                    Tắt thông báo
                </button>
            </motion.div>
        </motion.div>

    )
}


export default AlertSuccessSignUp