
import { MailOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAccount } from '../../../hooks/account';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { verifyEmailAPI } from '../../../api/user';

export default function VerifyEmailPage() {
    const { data } = useAccount()
    const navigate = useNavigate();
    useEffect(() => {
        if (!data?.blockcall) {
            if(data?.data.user.verify){
                navigate('/dashboard')
            }else{
               verifyEmailAPI()
            }
        }
    }, [])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="max-w-md w-full bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center"
            >
                <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800">
                        <MailOutlined style={{ fontSize: 32 }} className="text-indigo-600 dark:text-indigo-300" />
                    </div>
                </div>

                <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                    Xác nhận email của bạn
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Chúng tôi đã gửi một liên kết xác nhận tới địa chỉ email của bạn.
                </p>

                <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">
                    Vui lòng mở hộp thư và nhấp vào liên kết để hoàn tất việc xác thực tài khoản.
                </div>

                <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
                    Nếu bạn không thấy email trong hộp thư đến, hãy kiểm tra mục spam hoặc chờ vài phút.
                </div>
            </motion.div>
        </div>
    );
}