import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Crown, Trash2, ShieldCheck, User, UserPlus } from "lucide-react";
import { Link, Outlet, useParams } from "react-router-dom";
import { useRoleAccount } from "../../../hooks/role";
import { useEffect, useState } from "react";
import { getMemberHasJoinedGroupAPI, getMemberNotJoinedGroupAPI, updateChangeRoleConfirmerAPI, updateChangeRoleLeaderAPI, updateChangeRoleMemberAPI, updateKickMemberAPI } from "../../../api/group";

const listVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

interface Member {
    _id: string;
    username: string;
    avatar: string;
    role: "leader" | "member" | "confirmer";
    joined: boolean;
    email: string;
}

const roleVN = {
    leader: "Trưởng nhóm",
    confirmer: "Kiểm duyệt",
    member: "Thành viên"
};

const ListMemberInGroups = () => {
    const { id_group } = useParams();
    const { listRole } = useRoleAccount();
    const [joinedMembers, setJoinedMembers] = useState<Member[]>([]);
    const [notJoinedMembers, setNotJoinedMembers] = useState<Member[]>([]);
    const userRole = listRole?.[id_group || ""] || "leader";

    useEffect(() => {
        let isMounted = true;
        Promise.all([
            getMemberHasJoinedGroupAPI(id_group as string),
            getMemberNotJoinedGroupAPI(id_group as string)
        ]).then(([joinedRes, notJoinedRes]: any) => {
            if (!isMounted) return;

            const joined: Member[] = joinedRes.data?.members?.map((m: any) => ({
                _id: m.user._id,
                username: m.user.username,
                avatar: m.user.avatar,
                role: m.role,
                joined: true,
                email: m.user.email || "",
            })) || [];

            const notJoined: Member[] = notJoinedRes.data?.members?.map((m: any) => ({
                _id: m.user._id,
                username: m.user.username,
                avatar: m.user.avatar,
                role: m.role,
                joined: false,
                email: m.user.email || "",
            })) || [];

            setJoinedMembers(joined);
            setNotJoinedMembers(notJoined);
        });

        return () => { isMounted = false; };
    }, [id_group]);

    const renderMemberItem = (item: Member) => (
        <motion.div
            key={item._id}
            variants={itemVariants}
            className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-xl hover:bg-gray-700/70 transition-colors duration-200"
        >
            <div className="flex items-center space-x-3 text-white">
                <img src={item.avatar} className="w-6 h-6 rounded-full" alt="" />
                <div>
                    <div className="flex items-center gap-2">
                        <span>{item.username}</span>
                        <span className="px-2 py-0.5 text-xs bg-indigo-600 rounded-lg">{roleVN[item.role]}</span>
                    </div>
                    <span className="text-gray-400 text-sm">Email: {item.email}</span>
                </div>
                {item.role === "leader" && <Crown className="w-4 h-4 text-yellow-400" />}
                {item.role === "confirmer" && <ShieldCheck className="w-4 h-4 text-green-400" />}
            </div>
            {userRole === "leader" && item.role !== "leader" && (
                <div className="relative group">
                    <MoreVertical className="w-5 h-5 text-gray-300 cursor-pointer" />
                    <AnimatePresence>
                        <motion.ul
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute hidden group-hover:block z-50 p-2 top-full right-0 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-md"
                        >
                            <li
                                onClick={() => {
                                    updateChangeRoleLeaderAPI({
                                        id_group: id_group as string,
                                        userID: item._id
                                    })
                                }}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded-lg cursor-pointer"><Crown className="w-4 h-4 text-yellow-400" /> Nhượng quyền leader</li>
                            <li
                                onClick={() => {
                                    updateChangeRoleConfirmerAPI({
                                        id_group: id_group as string,
                                        userID: item._id
                                    })
                                }}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded-lg cursor-pointer"><ShieldCheck className="w-4 h-4 text-green-400" /> Người kiểm duyệt</li>
                            <li
                                onClick={() => {
                                    updateChangeRoleMemberAPI({
                                        id_group: id_group as string,
                                        userID: item._id
                                    })  
                                }}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded-lg cursor-pointer"><User className="w-4 h-4 text-gray-400" /> Chỉ là thành viên</li>
                            <li
                                onClick={() => {
                                    updateKickMemberAPI({
                                        id_group: id_group as string,
                                        userID: item._id
                                    })
                                }}
                            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4 text-red-400" /> Xóa thành viên</li>
                        </motion.ul>
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );

    const renderMemberList = (list: Member[], title: string) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-700 bg-gray-900/50 p-4 rounded-2xl shadow-lg"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {userRole === "leader" && title === "Danh sách thành viên" && (
                    <Link to={`add-member`}>
                        <motion.button whileTap={{ scale: 0.97 }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg transition">
                            <UserPlus className="w-4 h-4" /> Thêm thành viên
                        </motion.button>
                    </Link>
                )}
            </div>
            <hr className="border-gray-700 mb-3" />
            <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-2 max-h-96 overflow-y-auto">
                {list.length ? list.map(renderMemberItem) : <p className="text-gray-400 italic">Hiện tại đang trống.</p>}
            </motion.div>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            {renderMemberList(joinedMembers, "Danh sách thành viên")}
            {renderMemberList(notJoinedMembers, "Đang đợi chấp nhận")}
            <Outlet />
        </div>
    );
};

export { ListMemberInGroups };
