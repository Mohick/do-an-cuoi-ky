import { motion } from 'framer-motion';
import { Mail, InboxIcon, RefreshCw } from 'lucide-react';
import { useAccount } from '../../../hooks/account';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyEmailAPI } from '../../../api/user';

export default function VerifyEmailPage() {
  const { data } = useAccount();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!data?.blockcall) {
      if (data?.data.user.verify) {
        navigate('/dashboard');
      } else {
        verifyEmailAPI();
      }
    }
  }, []);

  const handleResend = async () => {
    if (resending || resent) return;
    setResending(true);
    try {
      await verifyEmailAPI();
      setResent(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1520] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 0.68, 0, 1.1] }}
        className="relative w-full max-w-sm bg-[#131b29] border border-[rgba(255,185,0,0.12)] rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#b37d00] to-[#ffb900]" />

        <div className="p-8 flex flex-col items-center gap-5 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="relative"
          >
            <div className="w-14 h-14 rounded-full bg-[rgba(255,185,0,0.08)] border border-[rgba(255,185,0,0.2)] flex items-center justify-center">
              <Mail size={24} className="text-[#ffb900]" />
            </div>
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-[rgba(255,185,0,0.3)]"
            />
          </motion.div>

          {/* Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.12em] text-[rgba(255,185,0,0.5)]">
                Xác thực tài khoản
              </span>
            </div>
            <h1 className="text-[15px] font-semibold text-[#f0f0f0]">
              Kiểm tra hộp thư của bạn
            </h1>
            <p className="text-[12px] text-white/35 leading-relaxed">
              Chúng tôi đã gửi liên kết xác nhận tới email của bạn. Vui lòng mở hộp thư và nhấp vào liên kết để hoàn tất xác thực.
            </p>
          </div>

          {/* Hint box */}
          <div className="w-full bg-[rgba(255,185,0,0.04)] border border-[rgba(255,185,0,0.1)] rounded-[10px] px-4 py-3 flex items-start gap-2">
            <InboxIcon size={13} className="text-[rgba(255,185,0,0.4)] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/30 text-left leading-relaxed">
              Không thấy email? Kiểm tra mục{" "}
              <span className="text-[rgba(255,185,0,0.5)]">Spam</span>{" "}
              hoặc <span className="text-[rgba(255,185,0,0.5)]">Thư rác</span> và chờ vài phút.
            </p>
          </div>

          {/* Resend */}
          <motion.button
            whileHover={{ scale: resending || resent ? 1 : 1.03 }}
            whileTap={{ scale: resending || resent ? 1 : 0.97 }}
            onClick={handleResend}
            disabled={resending || resent}
            className={`w-full flex items-center justify-center gap-2 py-[10px] rounded-[10px]
              text-[12px] font-medium transition-all cursor-pointer
              ${resent
                ? "bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] text-green-400/70 cursor-default"
                : "bg-[rgba(255,185,0,0.08)] border border-[rgba(255,185,0,0.18)] text-[#ffb900]/70 hover:bg-[rgba(255,185,0,0.14)]"
              } ${resending ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {resending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3.5 h-3.5 rounded-full border-2 border-[rgba(255,185,0,0.15)] border-t-[#ffb900]"
                />
                Đang gửi lại...
              </>
            ) : resent ? (
              "✓ Đã gửi lại email"
            ) : (
              <>
                <RefreshCw size={13} />
                Gửi lại email
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}