import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, FolderEdit,  CalendarDays, ImagePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpdateGroupInputs {
  user: string;
  projectName: string;
  endDate: string;
  image: FileList;
}

const inputClass = `
  w-full bg-[#1c2840] border border-[rgba(255,255,255,0.07)] rounded-[10px]
  px-4 py-[10px] text-[13px] text-[#e0e0e0] placeholder:text-white/20
  outline-none focus:border-[rgba(255,185,0,0.35)] focus:bg-[#1e2d47]
  transition-colors duration-200 [color-scheme:dark]
`;

const ModelUpdateInfoGroup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateGroupInputs>();

  const [preview, setPreview] = useState<string | null>(null);
  const file = watch("image");

  useEffect(() => {
    if (file && file[0]) {
      const url = URL.createObjectURL(file[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  const onSubmit = async (data: UpdateGroupInputs) => {
    // handle update logic here
    console.log(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 0.68, 0, 1.1] }}
        className="relative w-full max-w-2xl bg-[#131b29] border border-[rgba(255,185,0,0.12)] rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#b37d00] to-[#ffb900]" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,185,0,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[rgba(255,185,0,0.1)] border border-[rgba(255,185,0,0.2)] flex items-center justify-center">
              <FolderEdit size={14} className="text-[#ffb900]" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[#f0f0f0]">Cập nhật Group</h2>
              <p className="text-[10px] text-white/25 mt-0.5">Chỉnh sửa thông tin dự án</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-7 h-7 rounded-full border border-[rgba(255,185,0,0.2)] bg-[rgba(255,185,0,0.06)] text-[#ffb900] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-[rgba(255,185,0,0.55)] mb-2">
                  Tên dự án
                </label>
                <input
                  type="text"
                  placeholder="VD: Ứng dụng Quản lý Task"
                  {...register("projectName", { required: "Vui lòng nhập tên dự án" })}
                  className={inputClass}
                />
                {errors.projectName && <p className="text-red-400/70 text-[11px] mt-1.5">{errors.projectName.message}</p>}
              </div>

              {/* Ngày kết thúc */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-[rgba(255,185,0,0.55)] mb-2 flex items-center gap-1.5">
                  <CalendarDays size={10} /> Ngày kết thúc
                </label>
                <input
                  type="date"
                  {...register("endDate", { required: "Chọn ngày kết thúc" })}
                  className={inputClass}
                />
                {errors.endDate && <p className="text-red-400/70 text-[11px] mt-1.5">{errors.endDate.message}</p>}
              </div>
            </div>

            {/* RIGHT — image */}
            <div className="flex flex-col gap-3">
              <label className="block text-[11px] uppercase tracking-[0.1em] text-[rgba(255,185,0,0.55)]">
                Ảnh dự án
              </label>

              {/* Preview */}
              <motion.div
                className="relative flex-1 min-h-[160px] bg-[#1c2840] border-2 border-dashed border-[rgba(255,185,0,0.15)] rounded-[12px] overflow-hidden flex items-center justify-center hover:border-[rgba(255,185,0,0.3)] transition-colors group cursor-pointer"
              >
                {preview ? (
                  <>
                    <motion.img
                      src={preview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      loading="lazy"

                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] text-white/60 bg-black/40 px-3 py-1 rounded-full">Đổi ảnh</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <ImagePlus size={22} className="text-[rgba(255,185,0,0.3)] group-hover:text-[rgba(255,185,0,0.5)] transition-colors" />
                    <span className="text-[11px] text-white/25 group-hover:text-white/40 transition-colors">
                      Chọn ảnh
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "Vui lòng chọn ảnh" })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </motion.div>

              {errors.image && <p className="text-red-400/70 text-[11px]">{errors.image.message}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-end gap-2 border-t border-[rgba(255,255,255,0.04)] pt-4">
            <motion.button
              type="button"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-[7px] rounded-[9px] text-[12px] font-medium
                bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]
                text-white/40 hover:text-white/60 hover:border-[rgba(255,255,255,0.12)]
                transition-colors cursor-pointer"
            >
              Hủy
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`px-5 py-[7px] rounded-[9px] text-[12px] font-semibold transition-all
                ${isSubmitting
                  ? "bg-[rgba(255,185,0,0.06)] text-[#ffb900]/40 border border-[rgba(255,185,0,0.1)] cursor-not-allowed"
                  : "bg-[rgba(255,185,0,0.12)] text-[#ffb900] border border-[rgba(255,185,0,0.25)] hover:bg-[rgba(255,185,0,0.2)] cursor-pointer"
                }`}
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export { ModelUpdateInfoGroup };