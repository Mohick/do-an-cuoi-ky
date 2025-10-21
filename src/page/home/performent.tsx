import { motion } from "framer-motion";
import type { PropsSubTitleHomePage, PropsTitleHomePage } from "./components/title-homepage/props-title-homepage";
import TitlePage from "./components/title-homepage/title-page";
import LayoutApp from "../../layout";
import { ArrowRightOutlined } from "@ant-design/icons";






const title: PropsTitleHomePage = {
    text: ['Hiệu suất bứt phá ', ' công việc trôi chảy.'],
    className: 'text-center md:text-center'
}
const subTitle: PropsSubTitleHomePage = {
    text: 'Tham gia cùng hàng nghìn team đang sử dụng Task Manager để quản lý dự án hiệu quả',
    className: 'text-center md:text-center'
}

export default function Performent() {
    return (
        <>
            <div className="w-full h-screen flex justify-center items-center bg-[#131b29]">
                <LayoutApp className="flex justify-center flex-col md:space-y-10  gap-5 items-center">
                    <div>
                        <TitlePage title={title} subTitle={subTitle} className="md:space-y-10" />
                    </div>
                    <div className="inline-block space-y-3 ">
                        <motion.button
                            className="bg-white hover:border-white  hover:shadow-white shadow-md flex items-center gap-2 text-[#131b29] duration-300 hover:bg-[#131b29] hover:text-white py-2 px-4 rounded-md cursor-pointer border border-[#131b29] transition"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            Bắt đầu miễn phí
                            <ArrowRightOutlined />
                        </motion.button>
                        <motion.button
                            className=" text-white w-full hover:bg-white hover:shadow-white shadow-md hover:text-[#131b29] py-2 px-4 rounded-md cursor-pointer border duration-300 border-white transition"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            Tài liệu
                        </motion.button>
                    </div>
                </LayoutApp>
            </div>
        </>
    )
}