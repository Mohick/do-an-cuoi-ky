
import HeaderDashboard from "../../../components/header";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { handleCreateGroup } from "./handle-create-group";

const CreateGroup = () => {
  return (
    <div className="space-y-6">
      <HeaderDashboard backpage="/dashboard" title="Tạo Group" />
      <Form />
    </div>
  );
};

const Form = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState<string | null>(null);

  // preview ảnh khi chọn file
  const file = watch("image");
  if (file && file[0] && !preview) {
    const url = URL.createObjectURL(file[0]);
    setPreview(url);
  }

  return (
    <motion.form
      onSubmit={handleSubmit((data) => handleCreateGroup(data))}
      className=" flex flex-col  justify-center rounded-2xl shadow-lg space-y-6 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Người phụ trách */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <label className="block text-sm font-medium">Người phụ trách</label>
        <input
          type="text"
          {...register("user", { required: "Vui lòng nhập tên" })}
          className="mt-1 w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.user?.message && (
          <p className="text-red-400 text-sm">{String(errors.user.message)}</p>
        )}
      </motion.div>

      {/* Tên dự án */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <label className="block text-sm font-medium">Tên dự án</label>
        <input
          type="text"
          {...register("projectName", { required: "Vui lòng nhập tên dự án" })}
          className="mt-1 w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.projectName?.message && (
          <p className="text-red-400 text-sm">
            {String(errors.projectName.message)}
          </p>
        )}
      </motion.div>

      {/* Ngày kết thúc */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <label className="block text-sm font-medium">Ngày kết thúc</label>
        <input
          type="date"
          {...register("endDate", { required: "Chọn ngày kết thúc" })}
          className="mt-1 w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.endDate?.message && (
          <p className="text-red-400 text-sm">{String(errors.endDate.message)}</p>
        )}
      </motion.div>

      {/* Upload file ảnh */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <label className="block text-sm font-medium">Ảnh dự án</label>
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Vui lòng chọn ảnh" })}
          className="mt-1 w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setPreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
        {errors.image?.message && (
          <p className="text-red-400 text-sm">{String(errors.image.message)}</p>
        )}

        {preview && (
          <motion.img
            src={preview}
            alt="Preview"
            className="mt-3 rounded-lg max-h-48 object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </motion.div>

      {/* Submit */}
      <motion.button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.3)" }}
        whileTap={{ scale: 0.95 }}
      >
        Tạo dự án
      </motion.button>
    </motion.form>
  );
};

export default CreateGroup;
