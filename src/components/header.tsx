import { LeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import type { FC } from "react";
import { Link } from "react-router-dom";

interface Props_Header_Dashboard {
    title: string
    children?: React.ReactNode,
    backpage?: string | any
}

const HeaderDashboard: FC<Props_Header_Dashboard> = ({
    title,
    children,
    backpage = ""
}) => {
    return (
        <motion.div
            className="pys-6 flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="flex gap-2 items-center">
                {backpage && <Link to={backpage} className="" title="Về trang chủ">
                    <LeftOutlined className="text-2xl  cursor-pointer" />
                </Link>}
                <h1 className="text-3xl uppercase font-bold text-white">{title}</h1>
            </div>
            {children}
        </motion.div>
    );
};

export default HeaderDashboard;
