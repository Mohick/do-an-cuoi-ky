import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { User, UserCheck, UserPlus } from "lucide-react";
import { findUserByEmailAPI } from "../../../api/user";
import { handleAddMember } from "./handle-add-member";

type UserType = {
  id: string | number;
  _id: string;
  email: string;
  username: string;
};

type SearchResult = {
  valid: boolean;
  user?: UserType;
  userInGroup?: boolean;
  message?: string;
};

const ModelsAddMember = () => {
  const { id_group } = useParams();
  const navigate = useNavigate();
  const backPage = `/group/${id_group}/setting`;

  const [email, setEmail] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Gọi API tìm user theo email (có debounce)
  useEffect(() => {
    if (!email.trim()) {
      setResult(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      findUserByEmailAPI(email, id_group as string)
        .then((res: any) => setResult(res.data))
        .catch(() => {
          setResult({ valid: false, message: "Lỗi: Không tìm thấy người dùng." });
        })
        .finally(() => setLoading(false));
    }, 800);

    return () => clearTimeout(timer);
  }, [email, id_group]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl w-[420px] p-5 text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Thêm thành viên</h2>
          <CloseOutlined
            onClick={() => navigate(backPage)}
            className="cursor-pointer text-gray-400 hover:text-white transition"
          />
        </div>

        {/* Ô nhập email */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm text-gray-300">Tìm theo Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Nhập email người dùng..."
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        </div>

        {/* Kết quả */}
        <div className="mt-4 min-h-[80px]">
          <AnimatePresence mode="wait">
            {/* Loading */}
            {loading && (
              <motion.p
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-400 text-sm py-2"
              >
                🔍 Đang tìm kiếm...
              </motion.p>
            )}

            {/* Không hợp lệ */}
            {!loading && email && result && !result.valid && (
              <motion.p
                key="notfound"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-400 text-sm py-2"
              >
                ❌ {result.message || "Không tìm thấy người dùng"}
              </motion.p>
            )}

            {/* Hợp lệ */}
            {!loading && result && result.valid && result.user && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-gray-800 border border-gray-700 rounded-lg max-h-48 overflow-y-auto"
              >
                <div
                  key={result.user._id || result.user.id}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm">{result.user.username}</p>
                      <p className="text-xs text-gray-400">{result.user.email}</p>
                    </div>
                  </div>

                  {/* Nút mời / đã mời */}
                  <AnimatePresence mode="wait" initial={false}>
                    {result.userInGroup ? (
                      <motion.span
                        key="invited"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-1.5 text-xs text-yellow-400 px-3 py-1 bg-yellow-900/50 rounded-lg border border-yellow-700"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Đã mời
                      </motion.span>
                    ) : (
                      <motion.button
                        key="invite"
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={async () => {
                          const isSuccess = await handleAddMember({
                            id_group: id_group || "",
                            userID: result.user?._id || "",
                            email: `${result.user?.email}` || "",
                            groupName: "đẹp trai" ,
                            username: result.user?.username || "",
                          });

                          if (isSuccess) {
                            setResult((prev) =>
                              prev ? { ...prev, userInGroup: true } : prev
                            );
                          }
                        }}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-xs px-3 py-1 rounded-lg transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Gửi lời mời
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelsAddMember;
