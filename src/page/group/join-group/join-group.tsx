import { useEffect, useState } from "react";
import { updateVerifyJoinGroupAPI } from "../../../api/group";

const JoinGroup = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyGroup = async () => {
      try {
        const queryURL = new URL(window.location.href);
        const { id_verify } = Object.fromEntries(queryURL.searchParams);

        if (!id_verify) {
          setStatus("error");
          setMessage("Thiếu mã xác nhận nhóm.");
          return;
        }

        const res = await updateVerifyJoinGroupAPI({ id_verify }) as any;

        if (res.data?.valid) {
          setStatus("success");
          setMessage("🎉 Xác nhận tham gia nhóm thành công!");
        } else {
          setStatus("error");
          setMessage(res.data?.message || "Xác nhận tham gia nhóm thất bại.");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("Lỗi khi xác nhận nhóm, vui lòng thử lại sau.");
      }
    };

    verifyGroup();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      {status === "loading" && (
        <div className="animate-pulse text-gray-400 text-lg">Đang xác nhận lời mời...</div>
      )}

      {status === "success" && (
        <div className="text-green-400 text-xl font-semibold">
          ✅ {message}
        </div>
      )}

      {status === "error" && (
        <div className="text-red-400 text-lg font-medium">
          ❌ {message}
        </div>
      )}
    </div>
  );
};

export default JoinGroup;
