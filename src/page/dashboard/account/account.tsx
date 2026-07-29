import { AnimatePresence, motion } from 'framer-motion';
import {
    MailOutlined,
    EditOutlined,
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useAccount } from '../../../hooks/account';
import { Link, Outlet } from 'react-router-dom';

export type AvatarType = {
    url: string;
}
export interface UserInterface {
    username: string;
    email: string;
    avatar: AvatarType;
    _id: string
    bio: string
    
}


const AccountUser = () => {
    const { data } = useAccount();
    const userData = data?.data.user;

    // Tránh lỗi khi userData chưa load kịp
    if (!userData) return <div className="text-white">Loading...</div>;

    return (
        <div className="h-full flex flex-col gap-8 p-4">
            {/* Thằng này dùng để render các route con (như modal edit) */}
            <AnimatePresence>
                <Outlet context={userData} />
            </AnimatePresence>

            {/* HEADER SECTION */}
            <div className='flex flex-col xl:flex-row gap-6 justify-between items-center bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10'>
                <div className='flex flex-col sm:flex-row gap-6 items-center w-full xl:w-auto text-center sm:text-left'>
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className='relative group flex-shrink-0'
                    >
                        <img
                            src={userData.avatar.url}
                            loading="lazy"

                            alt="avatar"
                            className='w-24 h-24 rounded-full border-4 border-amber-400/50 object-cover shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                        />
                        <div className='absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity cursor-pointer'>
                            <EditOutlined className='text-white text-xl' />
                        </div>
                    </motion.div>

                    <div className='flex flex-col justify-center overflow-hidden w-full'>
                        <h2 className="text-3xl sm:text-4xl flex justify-center sm:justify-start font-black tracking-tighter italic break-all">
                            {userData.username.split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ x: -20, opacity: 0, filter: "blur(10px)" }}
                                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                                    transition={{ type: "spring", delay: index * 0.05 }}
                                    className='text-amber-50'
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </h2>

                        <div className="relative mt-2 inline-block max-w-full">
                            <p className="text-gray-400 flex justify-center sm:justify-start items-center gap-2 text-sm truncate">
                                <MailOutlined className='text-amber-400 shrink-0' />
                                <span className="truncate">Email: {userData.email}</span>
                            </p>
                            <motion.div
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: 0 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className='absolute inset-0 bg-amber-400 origin-right'
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center mt-4 xl:mt-0 w-full xl:w-auto">
                    <Link to={'edit-account'}>
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            className='bg-amber-400 p-3 rounded-xl cursor-pointer shadow-lg shadow-amber-400/20'
                        >
                            <SettingOutlined className='text-xl text-black' />
                        </motion.div>
                    </Link>

                    <Link to={'logout'}>
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: -15 }}
                            whileTap={{ scale: 0.9 }}
                            className='bg-red-500/10 border border-red-500/50 p-3 rounded-xl cursor-pointer shadow-lg shadow-red-500/10'
                        >
                            <LogoutOutlined className='text-xl text-red-500' />
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* BIO SECTION */}
            <div className='flex flex-col'>
                <div className='flex justify-between items-end mb-[-1px]'>
                    <div className='border border-white/20 border-b-0 font-black uppercase text-xs tracking-widest bg-white/5 px-6 py-3 relative rounded-t-lg overflow-hidden'>
                        <span className='relative z-10 text-amber-400'>Thông tin cơ bản</span>
                        {/* Cái gạch chéo decor */}
                        <div className='absolute -right-4 top-0 w-8 h-full bg-[#121212] rotate-12 border-l border-white/20'></div>
                    </div>

                    {/* Nút Edit Bio nhẹ nhàng */}
                    <Link to="edit-bio" className='text-gray-500 hover:text-amber-400 transition-colors flex items-center gap-1 text-xs mb-2 mr-2'>
                        <EditOutlined /> CHỈNH SỬA BIO
                    </Link>
                </div>

                <div className='border border-white/20 p-8 break-words rounded-b-xl flex flex-wrap rounded-tr-xl  backdrop-blur-md min-h-[150px] leading-relaxed'>
                    {userData.bio.split(" ").map((char, index) => {

                        return (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className='text-gray-300 text-lg font-light'
                            >
                                {char + "\u00A0"}
                            </motion.span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AccountUser;