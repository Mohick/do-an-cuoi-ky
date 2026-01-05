import { motion } from 'framer-motion';
import {
    MailOutlined,
    EditOutlined
} from '@ant-design/icons';
import { useAccount } from '../../../hooks/account';

const AccountUser = () => {
    // Dữ liệu mẫu (có thể thay thế bằng props)
    const { data } = useAccount()
    const userData = data?.data.user;

    
    return (
        <div className="flex items-center justify-center min-h-screen  p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
            >
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />

                {/* Content */}
                <div className="relative px-6 pb-6">
                    {/* Avatar */}
                    <div className="relative -top-12 flex justify-between items-end">
                        <div className="p-1 bg-white rounded-2xl shadow-lg">
                            <img
                                src={userData?.avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-xl bg-gray-50"
                            />
                        </div>
                        <button className="mb-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                            <EditOutlined className="text-gray-600" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="-mt-8">
                        <h2 className="text-2xl font-bold text-gray-800">{userData?.username}</h2>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center text-gray-600">
                                <MailOutlined className="mr-2" />
                                <span>{userData?.email}</span>
                            </div>

                        </div>
                    </div>


                </div>
            </motion.div>
        </div>
    );
};

export default AccountUser;