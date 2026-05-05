import { motion } from "framer-motion";

import { ArrowRightOutlined } from "@ant-design/icons";
import LayoutApp from "../../layout";
import TitlePage from "./components/title-homepage/title-page";
import { Link } from "react-router-dom";


const textSlogan = {
    text: ['Quản lý dự án', "hiệu quả hơn"],
    className: 'text-center'
};
const subtTitle = {
    text: 'Task Manager giúp bạn và team quản lý  công việc một cách trực quan với  Kanban board, theo dõi tiến độ real-time và tăng hiệu suất làm việc.',
    className: 'text-white'
}
export default function Slogan() {
    return (
        <div className=" h-screen flex justify-center flex-col gap-2 items-center w-full">
            <LayoutApp className="h-screen flex justify-center flex-col md:space-y-10  gap-5 items-center">
                <TitlePage title={textSlogan} subTitle={subtTitle} className="md:space-y-10" />
                <div className="flex flex-col md:flex-row gap-4 text-base md:text-3xl">
                    <Link to={"/auth"}>
                        <motion.button
                            className="bg-white hover:border-white  hover:shadow-white shadow-md flex items-center gap-2 text-[#131b29] duration-300 hover:bg-[#131b29] hover:text-white py-2 px-4 rounded-md cursor-pointer border border-[#131b29] transition"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            Bắt đầu miễn phí
                            <ArrowRightOutlined />
                        </motion.button>
                    </Link>
                    {/* <motion.button
                        className=" text-white hover:bg-white hover:shadow-white shadow-md hover:text-[#131b29] py-2 px-4 rounded-md cursor-pointer border duration-300 border-white transition"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        Tài liệu
                    </motion.button> */}
                </div>

            </LayoutApp>

        </div>
    );
}
