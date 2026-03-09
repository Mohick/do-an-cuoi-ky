import {  useEffect, useState } from "react";
import Logo from "../../components/logo";
import SignUp from "./sign-up/sign-up";
import { AnimatePresence } from "framer-motion";
import SignIn from "./sign-in/sign-in";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../../hooks/account";



// type SubmitPayload = {
//     title: string;
//     message: string;
//     validate: boolean;
// };


export default function Auth() {
    const [isLogin, setIsLogin] = useState(false);

    const { data } = useAccount()
    const navigate = useNavigate();
    useEffect(() => {
        if (!data?.blockcall) {
            if(data?.data.user.verify){
                navigate('/dashboard')
            }else{
                navigate('/verify-email')
            }
        }
    }, [])
    return (
        <div className="w-full bg-app flex justify-center items-center py-10 px-2 min-h-screen">
            <div className="max-w-[400px] w-9/12 bg-black p-5 space-y-5 rounded-md">
                <div className="space-y-2 flex flex-col items-center">
                    <Logo />
                    <p className="text-white text-sm opacity-45">
                        Quản lý công việc nhóm hiệu quả
                    </p>

                    {/* Toggle */}
                    <div className=" bg-gray-100/50 mt-2 w-full rounded-md">
                        <div className="relative flex w-full text-center">
                            {/* Nút */}
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2 z-10 transition-colors duration-300 ${!isLogin ? "text-black font-semibold" : "text-white cursor-pointer"
                                    }`}
                            >
                                Đăng nhập
                            </button>
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1  py-2 z-10 transition-colors duration-300 ${isLogin ? "text-black font-semibold " : "text-white cursor-pointer"
                                    }`}
                            >
                                Đăng ký
                            </button>
                            {/* Khối chạy qua lại */}
                            <div
                                className={`absolute top-0 left-0 h-full w-1/2 rounded-md bg-white transition-transform duration-300 ease-in-out ${isLogin ? "translate-x-full" : "translate-x-0"
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Form */}
                <AnimatePresence>
                    {!isLogin ? <SignIn /> : <SignUp />}
                </AnimatePresence>
                <Link to="/" className="text-white block capitalize text-center">về trang chủ</Link>
            </div>
        </div>
    );
}