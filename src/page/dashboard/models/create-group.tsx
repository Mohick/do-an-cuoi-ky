import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { X, ImagePlus, FolderPlus, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleCreateGroup } from "./handle-create-group";
import { useAlert } from "../../../components/alert/alert.hook";

interface GroupFormData {
  projectName: string;
  endDate: string;
  image: File[] | null;
}

const CreateGroup = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <Form />
    </div>
  );
};

const Form = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormData>();

  const [preview, setPreview] = useState<string | null>(null);
  const { addAlert } = useAlert() as any;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setPreview(null); setValue("image", null); return; }
    setPreview(URL.createObjectURL(file));
    setValue("image", [file]);
  };

  const removeImage = () => {
    setPreview(null);
    setValue("image", null);
    const input = document.getElementById("image-upload") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const onSubmit: SubmitHandler<GroupFormData> = async (data) => {
    await handleCreateGroup(data, navigate, addAlert);
  };

  const validateEndDate = (value: string) => {
    if (!value) return "Chọn ngày kết thúc";
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today || "Ngày kết thúc phải lớn hơn hoặc bằng hôm nay";
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="relative bg-[#131b29] border border-[rgba(255,185,0,0.12)] w-full max-w-2xl rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 0.68, 0, 1.1] }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#b37d00] to-[#ffb900]" />

      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,185,0,0.08)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[rgba(255,185,0,0.1)] border border-[rgba(255,185,0,0.2)] flex items-center justify-center">
            <FolderPlus size={15} className="text-[#ffb900]" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-[#f0f0f0] leading-tight">
              Tạo dự án mới
            </h2>
            <p className="text-[11px] text-white/30 mt-0.5">Điền thông tin để khởi tạo nhóm</p>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-7 h-7 rounded-full border border-[rgba(255,185,0,0.2)] bg-[rgba(255,185,0,0.06)] text-[#ffb900] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </motion.button>
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-5">
          {/* Project name */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.1em] text-[rgba(255,185,0,0.55)] mb-2">
              Tên dự án
            </label>
            <input
              type="text"
              {...register("projectName", { required: "Vui lòng nhập tên dự án" })}
              placeholder="Ví dụ: Ứng dụng Quản lý Task"
              disabled={isSubmitting}
              className="w-full bg-[#1c2840] border border-[rgba(255,255,255,0.07)] rounded-[10px]
                px-4 py-[10px] text-[13px] text-[#e0e0e0] placeholder:text-white/20
                outline-none focus:border-[rgba(255,185,0,0.35)] focus:bg-[#1e2d47]
                transition-colors duration-200"
            />
            {errors.projectName && (
              <p className="text-red-400/80 text-[11px] mt-1.5">{errors.projectName.message}</p>
            )}
          </div>

          {/* End date */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.1em] text-[rgba(255,185,0,0.55)] mb-2 flex items-center gap-1.5">
              <CalendarDays size={11} />
              Ngày kết thúc
            </label>
            <input
              type="date"
              {...register("endDate", { validate: validateEndDate })}
              disabled={isSubmitting}
              className="w-full bg-[#1c2840] border border-[rgba(255,255,255,0.07)] rounded-[10px]
                px-4 py-[10px] text-[13px] text-[#e0e0e0]
                outline-none focus:border-[rgba(255,185,0,0.35)] focus:bg-[#1e2d47]
                transition-colors duration-200
                [color-scheme:dark]"
            />
            {errors.endDate && (
              <p className="text-red-400/80 text-[11px] mt-1.5">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* RIGHT — image upload */}
        <div className="flex flex-col gap-2">
          <label className="block text-[11px] uppercase tracking-[0.1em] text-[rgba(255,185,0,0.55)]">
            Ảnh đại diện
          </label>
          <div className="relative flex-1 min-h-[140px] bg-[#1c2840] border-2 border-dashed border-[rgba(255,185,0,0.15)] rounded-[12px] overflow-hidden flex items-center justify-center hover:border-[rgba(255,185,0,0.3)] transition-colors group">
            {preview ? (
              <>
                <motion.img
                  src={preview}
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <motion.button
                  type="button"
                  onClick={removeImage}
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500/80 border border-red-400/30 flex items-center justify-center text-white"
                >
                  <X size={12} />
                </motion.button>
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
              id="image-upload"
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              required={!preview}
              disabled={isSubmitting}
            />
          </div>
          {errors.image && (
            <p className="text-red-400/80 text-[11px]">{errors.image.message}</p>
          )}
        </div>
      </div>

      {/* Footer — submit */}
      <div className="px-6 pb-6">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className={`w-full py-[11px] rounded-[10px] text-[13px] font-semibold transition-all
            ${isSubmitting
              ? "bg-[rgba(255,185,0,0.06)] text-[#ffb900]/40 border border-[rgba(255,185,0,0.1)] cursor-not-allowed"
              : "bg-[rgba(255,185,0,0.12)] text-[#ffb900] border border-[rgba(255,185,0,0.25)] hover:bg-[rgba(255,185,0,0.2)] cursor-pointer"
            }`}
        >
          {isSubmitting ? "Đang tạo..." : "Tạo Dự Án"}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default CreateGroup;