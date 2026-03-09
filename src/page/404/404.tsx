










import { motion } from "framer-motion"
import { FrownOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { useAccount } from "../../hooks/account"

export default function NotFoundPage() {
    const { data } = useAccount()
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="flex justify-center mb-6"
                >
                    <FrownOutlined className="text-red-500 text-7xl" />
                </motion.div>

                <h1 className="text-4xl font-bold mb-2 text-gray-800">404</h1>
                <p className="text-gray-600 mb-6">Oops! Trang bạn tìm không tồn tại.</p>

                <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                        to={!data?.blockcall ? "/dashboard" : "/"}
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
                    >
                       { !data?.blockcall ?"về trang dashboard " : 'về trang chủ'}
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}
