import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { checkVerifyAPI } from "../../../api/user";
import { useParams } from "react-router-dom";

const CheckVerify = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const { id } = useParams()
  useEffect(() => {
    checkVerifyAPI({ key: id }).then((res: any) => {
      setIsVerified(res.data.valid)
    }).catch(() => {
      setIsVerified(false)
    })
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {isVerified === null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 text-lg font-medium text-gray-600"
        >
          <LoadingOutlined className="animate-spin text-4xl text-blue-500" />
          <span>Đang kiểm tra...</span>
        </motion.div>
      ) : isVerified ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center"
        >
          <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Xác minh thành công!</h2>
          <p className="text-gray-500 mb-6">
            Bạn đã được xác minh thành công.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/dashboard")}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow hover:bg-green-600 transition"
          >
            Về Dashboard
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center"
        >
          <CloseCircleOutlined className="text-red-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Xác minh thất bại</h2>
          <p className="text-gray-500">Có lỗi xảy ra, vui lòng thử lại sau.</p>
        </motion.div>
      )}
    </div>
  );
};

export default CheckVerify;
