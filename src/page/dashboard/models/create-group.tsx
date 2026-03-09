import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
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
    <div className="fixed  inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
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
  const { addAlert } = useAlert() as any
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setPreview(null);
      setValue("image", null);
      return;
    }

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

  // Hàm validate ngày kết thúc
  const validateEndDate = (value: string) => {
    if (!value) return "Chọn ngày kết thúc";
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // chỉ so sánh ngày, không so sánh giờ
    return selected >= today || "Ngày kết thúc phải lớn hơn hoặc bằng hôm nay";
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="relative bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-3xl space-y-8"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* CLOSE BUTTON */}
      <motion.button
        type="button"
        className="absolute top-4 right-4 text-gray-300 hover:text-white transition p-2 rounded-full bg-gray-700/50 hover:bg-gray-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/dashboard")}
      >
        <X size={20} />
      </motion.button>

      <h2 className="text-3xl font-extrabold text-blue-400 mb-6 border-b border-gray-700 pb-3">
        Thông tin Dự án
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          <motion.div whileHover={{ x: 3 }}>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Tên dự án
            </label>
            <input
              type="text"
              {...register("projectName", { required: "Vui lòng nhập tên dự án" })}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Ví dụ: Ứng dụng Quản lý Task"
            />
            {errors.projectName && (
              <p className="text-red-400 text-sm mt-1">{errors.projectName.message}</p>
            )}
          </motion.div>

          <motion.div whileHover={{ x: 3 }}>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Ngày kết thúc
            </label>
            <input
              type="date"
              {...register("endDate", { validate: validateEndDate })}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.endDate && (
              <p className="text-red-400 text-sm mt-1">{errors.endDate.message}</p>
            )}
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-300">Ảnh đại diện Dự án</label>

          <div className="relative w-full aspect-[4/3] bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg overflow-hidden flex items-center justify-center">
            {preview ? (
              <>
                <motion.img
                  src={preview}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <motion.button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600/70 p-1.5 rounded-full text-white"
                  whileHover={{ scale: 1.1 }}
                >
                  <X size={16} />
                </motion.button>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Chọn ảnh</p>
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
          {errors.image && <p className="text-red-400 text-sm">{errors.image.message}</p>}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <motion.button
        type="submit"
        className={`w-full py-3 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg transition mt-6 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang tạo..." : "Tạo Dự Án Ngay"}
      </motion.button>
    </motion.form>
  );
};

export default CreateGroup;
