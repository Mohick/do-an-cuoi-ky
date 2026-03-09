
import { UsergroupAddOutlined } from "@ant-design/icons";
import LayoutApp from "../../layout";
import { motion } from "framer-motion";



const obItems: {
    icon: React.ReactNode,
    title: string,
    subTitle: string,
    key?: string
}[] = [
        {
            key: '1',
            icon: <UsergroupAddOutlined />,
            title: 'Quản lý nhóm hiệu quả',
            subTitle: 'Tạo và quản lý nhiều nhóm dự án, mời thành viên và phân công công việc một cách dễ dàng.'
        },
        {
            key: '2',
            icon: <UsergroupAddOutlined />,
            title: 'Quản lý nhóm hiệu quả',
            subTitle: 'Tạo và quản lý nhiều nhóm dự án, mời therapists và phân công công việc một cách dễ dàng.'
        },
        {
            key: '3',
            icon: <UsergroupAddOutlined />,
            title: 'Quản lý nhóm hiệu quả',
            subTitle: 'Tạo và quản lý nhiều nhóm dự án, mời therapists và phân công công việc một cách dễ dàng.'
        },
    ]

export const variantsFeature = {
    start: { opacity: 0, y: 50 },
    visible(customDelay: number) {
        return {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: customDelay,
            },
        };
    }
}

export default function IntroductionFeature() {
    return (
        <>
            <div className="w-full min-h-screen flex justify-center items-center bg-[#131b29]">
                <LayoutApp className="grid md:grid-cols-3  gap-5">
                    {obItems.map((item, index) => <motion.div key={item.key}
                        initial={'start'}
                        whileInView={'visible'}
                        variants={variantsFeature}
                        viewport={{ amount: 0.1, once: true }}
                        custom={(index+1) /2}
                        >
                        <Items key={item.key} {...item} />
                    </motion.div>)}
                </LayoutApp>
            </div>  
        </>
    )
}


const Items = ({ icon, title = '', subTitle = '' }: { icon?: React.ReactNode, title?: string, subTitle?: string, }) => {


    return <div className="bg-[#09090b] p-5 space-y-3 rounded-md">
        <div className="bg-[#1e3a8a] text-2xl text-[#5da1f6] inline-block px-2 py-1 rounded-md">
            {icon}
        </div>
        <h2 className="text-2xl font-bold text-white">
            {title}
        </h2>
        <p className="text-[#a1a1aa] text-justify">
            {subTitle}
        </p>
    </div>
}