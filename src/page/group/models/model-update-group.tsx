import  { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

// Định nghĩa kiểu dữ liệu cho form
interface UpdateGroupInputs {
    user: string;
    projectName: string;
    endDate: string;
    image: FileList;
}

// Thêm Props cho component, nhận vào hàm để đóng modal

const ModelUpdateInfoGroup  = () => {
    const {
        register,   
        watch,
        formState: { errors },
    } = useForm<UpdateGroupInputs>();

    const [preview, setPreview] = useState<string | null>(null);

    // Lấy giá trị file từ react-hook-form
    const file = watch("image");

    // *** CẢI TIẾN: Dùng useEffect để xử lý preview ảnh ***
    // Logic này sạch hơn và tự động dọn dẹp (revoke) khi component unmount
    useEffect(() => {
        if (file && file[0]) {
            const newPreviewUrl = URL.createObjectURL(file[0]);
            setPreview(newPreviewUrl);

            // Cleanup function để tránh memory leak
            return () => URL.revokeObjectURL(newPreviewUrl);
        } else {
            // Nếu không có file (ví dụ: người dùng reset form) thì clear preview
            setPreview(null);
        }
    }, [file]);

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
            <motion.form
                // onSubmit={handleSubmit(handleUpdateGroup)}
                className="relative flex flex-col lg:max-w-4xl bg-gray-900 p-8 justify-center rounded-2xl shadow-lg space-y-6 w-full text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    {/* Dùng SVG cho icon X */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-center text-white mb-2">
                    Cập nhật Group
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- CỘT BÊN TRÁI: Thông tin --- */}
                    <div className="space-y-6">
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
                    </div>

                    {/* --- CỘT BÊN PHẢI: Upload ảnh --- */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium">Ảnh dự án</label>

                        {/* Preview ảnh */}
                        {preview && (
                            <motion.div
                                className="w-full h-48 flex justify-center items-center bg-gray-800 rounded-lg overflow-hidden"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "12rem" }} // 12rem = h-48
                            >
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            </motion.div>
                        )}

                        {/* Input file */}
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image", { required: "Vui lòng chọn ảnh" })}
                            // *** XÓA: Bỏ onChange setPreview ở đây, đã dùng useEffect ***
                            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {errors.image?.message && (
                            <p className="text-red-400 text-sm">{String(errors.image.message)}</p>
                        )}
                    </div>
                </div>

                {/* *** THAY ĐỔI: Thêm khu vực Nút bấm (Actions) *** */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                    {/* Nút Hủy */}
                    <motion.button
                        type="button"
                        className="py-2 px-6 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Hủy
                    </motion.button>

                    {/* Nút Submit (Cập nhật) */}
                    <motion.button
                        type="submit"
                        className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                        whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.3)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Cập nhật
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
};

export { ModelUpdateInfoGroup };