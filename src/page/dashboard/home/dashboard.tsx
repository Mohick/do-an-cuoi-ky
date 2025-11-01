
// File: pages/Dashboard.jsx

import Items from "./items-page-dashboard";
import { motion } from "framer-motion";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { Link } from "react-router-dom";
import HeaderDashboard from "../../../components/header";
import { useEffect, useState } from "react";
import { getGroupAPI } from "../../../api/group";
import type { PropsGetGroup } from "../../../api/props/group/props-get";


const HomeDashboard = () => {
    const [group, setGroup] = useState<PropsGetGroup>({})
    useEffect(() => {
        getGroupAPI().then((res: any) => {
            const data: PropsGetGroup = res.data ? res.data : {}

            setGroup(data)
        }
        ).catch(err => console.log(err))
    }, [])
    if (!group.valid) return <div>Loading...</div>
    return (
        <div className="space-y-6   min-h-screen">
            <HeaderDashboard title="Trang Chủ">
                <Link to="create-group">
                    <motion.button
                        className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg shadow hover:bg-blue-700 transition"
                        whileHover={{ scale: 1.05, boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Tạo Group
                        <PlusCircleTwoTone className="ml-2" />
                    </motion.button>
                </Link>
            </HeaderDashboard>

            <>
                <GroupSection title="Đang Làm" items={(group as any).groups} />
            </>

        </div>
    );
};

type GroupSectionProps = {
    title: string;
    items: any[];
};

const GroupSection = ({ title, items }: GroupSectionProps) => (
    <div className="group space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
            {title}
        </h2>
        {items?.length ? (
            <div className="w-full grid grid-cols-12 gap-6">
                {items.map((item) => (
                    <Items
                        id={item._id}
                        key={item._id}
                        image={item.image}
                        status={item.status}
                        creator={item.creator}
                        timeLine={{ from: item.createdAt, to: item.deadline }}
                        title={item.name}
                        subtitle={item.description}
                        statusItems={item.status}
                    />
                ))}
            </div>
        ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Không có dữ liệu</p>
        )}
    </div>
);



export default HomeDashboard;
