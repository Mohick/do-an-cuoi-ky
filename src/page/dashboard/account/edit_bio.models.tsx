import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { X, FileEdit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { UserInterface } from "./account";
import { updateBioAPI } from "../../../api/user";
import { useAccount } from "../../../hooks/account";

const MAX = 500;

const EditBio = () => {
  const user: UserInterface = useOutletContext();
  const { refetch } = useAccount();
  const { register, handleSubmit, watch } = useForm<{ bio: string }>();
  const bioValue = watch("bio", user.bio);
  const charCount = bioValue?.length ?? 0;
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data: { bio: string }) => {
    setSaving(true);
    try {
      await updateBioAPI(data);
      await refetch();
      navigate("/dashboard/account");
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.22, 0.68, 0, 1.1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md bg-[#131b29] border border-[rgba(255,185,0,0.12)] rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#b37d00] to-[#ffb900]" />

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-[rgba(255,185,0,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[rgba(255,185,0,0.1)] border border-[rgba(255,185,0,0.2)] flex items-center justify-center">
              <FileEdit size={14} className="text-[#ffb900]" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#f0f0f0]">Chỉnh sửa Bio</h2>
              <p className="text-[10px] text-white/25 mt-0.5">Tối đa {MAX} ký tự</p>
            </div>
          </div>
          <Link to="/dashboard/account">
            <button className="w-7 h-7 rounded-full border border-[rgba(255,185,0,0.2)] bg-[rgba(255,185,0,0.06)] text-[#ffb900] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <X size={13} />
            </button>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-5 space-y-3">
            <label className="block text-[11px] uppercase tracking-[0.1em] text-[rgba(255,185,0,0.55)]">
              Giới thiệu bản thân
            </label>

            <div className="relative">
              <textarea
                defaultValue={user.bio}
                {...register("bio", { maxLength: MAX })}
                maxLength={MAX}
                rows={8}

                placeholder="Viết gì đó về bản thân bạn..."
                className="w-full bg-[#1c2840] border border-[rgba(255,255,255,0.07)] rounded-[10px]
                  px-4 py-3 text-[13px] text-[#e0e0e0] placeholder:text-white/20
                  outline-none focus:border-[rgba(255,185,0,0.35)] focus:bg-[#1e2d47]
                  transition-colors duration-200 resize-none leading-relaxed"
              />
              {/* Char counter */}
              <div className={`absolute bottom-3 right-3 text-[10px] tabular-nums
                ${charCount >= MAX ? "text-red-400/70" : charCount >= MAX * 0.8 ? "text-[rgba(255,185,0,0.5)]" : "text-white/20"}`}>
                {charCount}/{MAX}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 flex gap-2 justify-end">
            <Link to="/dashboard/account">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-[7px] rounded-[9px] text-[12px] font-medium
                  bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]
                  text-white/40 hover:text-white/60 hover:border-[rgba(255,255,255,0.12)]
                  transition-colors cursor-pointer"
              >
                Hủy
              </motion.button>
            </Link>

            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.03 }}
              whileTap={{ scale: saving ? 1 : 0.97 }}
              className={`px-5 py-[7px] rounded-[9px] text-[12px] font-semibold transition-all
                ${saving
                  ? "bg-[rgba(255,185,0,0.06)] text-[#ffb900]/40 border border-[rgba(255,185,0,0.1)] cursor-not-allowed"
                  : "bg-[rgba(255,185,0,0.12)] text-[#ffb900] border border-[rgba(255,185,0,0.25)] hover:bg-[rgba(255,185,0,0.2)] cursor-pointer"
                }`}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditBio;