import { motion } from "framer-motion"
import LayoutApp from "../../layout"
import { variantsFeature } from "./feature"
import { StarFilled, StarOutlined } from "@ant-design/icons"




const obItems: {
    key?: number
    start?: number
    comment?: string
    fullname?: string
    jobTitle?: string
}[] = [
    {
        key: 1,
        start: 5,
        comment: 'Task Manager đã giúp team chúng tôi tăng hiệu suất làm việc lên 40%. Giao diện trực quan và dễ sử dụng.',
        fullname: 'Nguyễn Văn A',
        jobTitle: 'Project Manager tại Tech Corp'
    },
    {
        key: 2,
        start: 5,
        comment: 'Tính năng Kanban board rất tuyệt vời, giúp chúng tôi theo dõi tiến độ dự án một cách rõ ràng.',
        fullname: 'Trần Thị B',
        jobTitle: 'Team Lead tại Digital Agency'
    },
    {
        key: 3,
        start: 5,
        comment: 'Đây là công cụ quản lý task tốt nhất mà tôi từng sử dụng. Highly recommended!',
        fullname: 'Lê Văn C',
        jobTitle: 'Developer tại Startup XYZ'
    }
]


export default function CustomerTalk() {
    return (
        <>
            <div className="w-full h-screen flex justify-center items-center bg-[#131b29]">
                <LayoutApp className="grid md:grid-cols-3  gap-5">
                    {obItems.map((item, index) => <motion.div key={item.key}
                        initial={'start'}
                        whileInView={'visible'}
                        variants={variantsFeature}
                        viewport={{ amount: 0.1, once: true }}
                        custom={(index + 1) / 2}
                    >
                        <Items key={item.key} {...item} />
                    </motion.div>)}
                </LayoutApp>
            </div>
        </>
    )
}

const Items = ({ start, comment, fullname, jobTitle }: { start?: number, comment?: string, fullname?: string, jobTitle?: string }) => {

    return <div className="w-full space-y-3.5 h-full p-5 rounded-md bg-black text-white">
        <div className={`text-yellow-300`}>
            <StarFilled />
            <StarFilled />
            <StarFilled />
            <StarFilled />
            <StarFilled />
        </div>
        <p>
            "{comment}"
        </p>
        <div>
            <h3 className="font-bold">
                {fullname}
            </h3>
            <p className="text-white/50">
                {jobTitle}
            </p>
        </div>

    </div>
}