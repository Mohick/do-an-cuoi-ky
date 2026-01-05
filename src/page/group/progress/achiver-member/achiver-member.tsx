import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, CheckCircle, Table, Crown, Mail, Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { getTopFiveMembersAPI } from "../../../../api/group";

// --- Định nghĩa Interface (Giữ nguyên) ---
interface MemberRoleInfo {
    user: string;
    role: 'leader' | 'member' | 'confirmer' | string;
    _id: string;
}

interface TopMember {
    _id: string;
    username: string;
    email: string;
    totalTasksCompleted: number;
    role: MemberRoleInfo;
}

// interface TopMemberResponse {
//     valid: boolean;
//     topMember: TopMember[];
//     message: string;
// }
// // ---------------------------------------------------


// Component Rank Icon (Giữ nguyên)
const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) {
        return (
            <div className="flex items-center justify-center p-0.5 rounded-full bg-yellow-600/50">
                <Crown className="w-4 h-4 text-yellow-300" />
            </div>
        );
    }
    return (
        <div className="w-5 h-5 rounded-full bg-blue-700/50 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">{rank}</span>
        </div>
    );
};

// Component Role Ribbon (Giữ nguyên)
const RoleRibbon = ({ roleInfo }: { roleInfo: MemberRoleInfo }) => {
    const roleString = roleInfo.role || 'member';

    const displayRoleMap: Record<string, string> = {
        'leader': 'LEADER',
        'confirmer': 'XÁC NHẬN',
        'member': 'THÀNH VIÊN',
    };
    const displayRole = displayRoleMap[roleString.toLowerCase()] || 'MEMBER';

    const roleColors: Record<string, string> = {
        'leader': 'bg-red-600/90 text-white shadow-xl shadow-red-700/50',
        'confirmer': 'bg-orange-600/90 text-white shadow-xl shadow-orange-700/50',
        'member': 'bg-purple-600/90 text-white shadow-xl shadow-purple-700/50',
    };

    const colorClass = roleColors[roleString.toLowerCase()] || 'bg-gray-500/90 text-white';

    return (
        <div
            className={`absolute top-0 right-0 py-0.5 px-6 text-[10px] font-extrabold uppercase origin-top-right transform translate-x-1/2 -translate-y-1/2 rotate-45 
            shadow-lg z-10 ${colorClass}`}
            style={{ width: '100px' }}
        >
            {displayRole}
        </div>
    );
};


// Component Task Stat (Giữ nguyên)
const TaskStat = ({ icon: Icon, label, count, colorClass, bgColorClass }: {
    icon: React.ElementType,
    label: string,
    count: number,
    colorClass: string,
    bgColorClass: string
}) => (
    <motion.div
        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-md ${bgColorClass}`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <span className={`text-xl font-bold ${colorClass}`}>{count}</span>
        <div className="flex items-center gap-1 mt-1">
            <Icon className={`w-3 h-3 ${colorClass}`} />
            <span className={`text-[10px] font-medium ${colorClass}`}>{label}</span>
        </div>
    </motion.div>
);


export default function MemberTable() {
    const { id_group } = useParams();
    const [topMembers, setTopMembers] = useState<TopMember[]>([]);
    // ❌ ĐÃ XÓA state selectedMember
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Gọi API trong useEffect (Giữ nguyên) ---
    useEffect(() => {
        if (!id_group) {
            setError("Không tìm thấy ID nhóm.");
            setIsLoading(false);
            return;
        }

        const fetchTopMembers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getTopFiveMembersAPI({ id_group: id_group as string }) as any

                if (response.data.valid && Array.isArray(response.data.topMember)) {
                    setTopMembers(response.data.topMember);
                } else {
                    setError(response.data.message || "Không thể tải dữ liệu thành viên.");
                    setTopMembers([]);
                }
            } catch (err) {
                console.error("Lỗi gọi API:", err);
                setError("Lỗi kết nối hoặc server.");
                setTopMembers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopMembers();
    }, [id_group]);


    // ❌ ĐÃ XÓA hàm handleClick


    // --- Định nghĩa Framer Motion Variants (Giữ nguyên) ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants: {} = {
        hidden: { x: -10, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 120 },
        },
    };
    // --------------------------------------------------------


    // --- Render Loading/Error States (Giữ nguyên) ---
    if (isLoading) {
        return (
            <div className="w-full max-w-xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-700 flex flex-col items-center justify-center h-40">
                <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="mt-4 text-white">Đang tải bảng xếp hạng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-xl mx-auto bg-red-900/30 p-8 rounded-xl border border-red-700">
                <p className="text-red-400 font-medium">Lỗi: {error}</p>
            </div>
        );
    }

    if (topMembers.length === 0) {
        return (
            <div className="w-full max-w-xl mx-auto bg-gray-800 p-8 rounded-xl border border-gray-700">
                <p className="text-gray-400 font-medium">Không có thành viên nào hoàn thành task trong nhóm này.</p>
            </div>
        );
    }


    return (
        <div className="w-full max-w-xl mx-auto bg-gray-900 p-4 md:p-6 rounded-xl shadow-2xl border border-gray-700 h-full overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-white mb-4 border-b border-gray-700 pb-2">
                <Table className="w-5 h-5 inline-block text-blue-400 mr-2" /> Bảng xếp hạng Top {topMembers.length}
            </h2>

            <motion.div
                className="flex flex-col gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {topMembers.map((m, index) => (
                    <div
                        key={m._id}
                        className="shadow-lg shadow-gray-950/50 rounded-lg relative overflow-hidden"
                    >
                        {/* ROLE RIBBON */}
                        <RoleRibbon roleInfo={m.role} />

                        <motion.div
                            variants={
                                itemVariants
                            }
                            // ❌ XÓA onClick={handleClick(m)} để tránh hiển thị chi tiết
                            className={`flex items-center relative justify-between px-5 py-2 transition-all duration-300
                                bg-gray-900 border border-gray-800 hover:shadow-xl hover:border-blue-600
                                cursor-pointer`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="flex items-center gap-3">

                                {/* User Info Block */}
                                <div className="flex flex-col relative items-center flex-shrink-0 mr-2">
                                    <motion.div
                                        className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-0.5"
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <User className="text-blue-400 w-4 h-4" />
                                    </motion.div>
                                    <div className="absolute -top-3 -left-2 p-2 z-20">
                                        <RankIcon rank={index + 1} />
                                    </div>
                                    {/* ROLE CỦA MEMBER */}
                                    <p className={`text-[9px] font-semibold px-1 py-0 rounded-full 
                                        ${m.role.role === 'leader' ? 'bg-red-900/50 text-red-400' :
                                            m.role.role === 'confirmer' ? 'bg-orange-900/50 text-orange-400' :
                                                'bg-purple-900/50 text-purple-400'
                                        }`}
                                    >
                                        {m.role.role.toUpperCase()}
                                    </p>
                                </div>

                                {/* Username & Email */}
                                <div>
                                    <p className="font-bold text-base text-white">{m.username}</p>
                                    <p className="text-gray-400 text-xs flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {m.email}
                                    </p>
                                </div>
                            </div>

                            {/* Right section: Stats */}
                            <div className="w-[120px]">
                                <TaskStat
                                    icon={CheckCircle}
                                    label="Hoàn thành"
                                    count={m.totalTasksCompleted}
                                    colorClass="text-green-400"
                                    bgColorClass="bg-green-900/30"
                                />
                            </div>
                        </motion.div>
                    </div>
                ))}
            </motion.div>

            {/* ❌ KHỐI SELECTED MEMBER DETAILS ĐÃ ĐƯỢC XÓA */}

        </div>
    );
}