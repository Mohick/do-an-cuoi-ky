import HeaderDashboard from "../../../components/header";
import { ListMemberInGroups } from "./list-members";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useRoleAccount } from "../../../hooks/role";
import { Link, useParams } from "react-router-dom";

// --- Component hiển thị tên group + nút chỉnh sửa ---
interface GroupHeaderProps {
    groupName: string;
    onEdit?: () => void;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ groupName, onEdit }) => {
    return (
        <Link to={`edit-group`} className="flex items-center justify-between bg-gray-900/50 border border-gray-700 p-4 rounded-2xl shadow-md mb-4">
            <h2 className="text-xl font-semibold text-white">{groupName}</h2>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition"
            >
                <Edit2 className="w-4 h-4" /> Chỉnh sửa
            </motion.button>
        </Link>
    );
};

// --- Page Setting ---
const Setting = () => {
    const { listRole } = useRoleAccount();
    const { id_group } = useParams();
    const userRole = listRole?.[id_group || ""] || "leader";

    return (
        <div className="space-y-6">
            <HeaderDashboard title="Cài đặt" />
            <br className="h-5" />

            {userRole === "leader" && <GroupHeader
                groupName="Tên nhóm của bạn"
            />}

            <ListMemberInGroups />

            {/* Nút xóa group ở cuối */}
            {userRole === "leader" ? <div className="flex justify-end">
                <Link to={'delete'}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition"
                    >
                        <Trash2 className="w-4 h-4" /> Xóa group
                    </motion.button>
                </Link>
            </div> : <div className="flex justify-end">
                <Link to={'leave'}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition"
                    >
                        <Trash2 className="w-4 h-4" /> Rời nhóm
                    </motion.button>
                </Link>
            </div>}
        </div>
    );
};

export default Setting;
