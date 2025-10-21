"use client"

import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { handleCreateTask } from "./handle-create"
import type { PropsCreateTask } from "../../../api/props/task/create"
import { XOutlined } from "@ant-design/icons"

const CreateTask = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PropsCreateTask>()
  const { id_group } = useParams()
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.form
        onSubmit={handleSubmit((data) => handleCreateTask(data, id_group as string))}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg space-y-5 rounded-lg bg-white/10 p-6 shadow-lg backdrop-blur-md border border-white/30"
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
        >
          <XOutlined size={22} />
        </button>

        {/* Tên task */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Tên Task *</label>
          <input
            type="text"
            {...register("task_name", { required: "Tên task là bắt buộc" })}
            className="w-full rounded-lg border border-white/40 bg-transparent text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.task_name && <p className="text-red-400 text-sm mt-1">{errors.task_name.message}</p>}
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Đường dẫn (URL)</label>
          <input
            type="url"
            {...register("url", {
              pattern: { value: /^(https?:\/\/[^\s]+)$/, message: "URL không hợp lệ" },
            })}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-white/40 bg-transparent text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.url && <p className="text-red-400 text-sm mt-1">{errors.url.message}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Mô tả</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full rounded-lg border border-white/40 bg-transparent text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Timeline *</label>
          <input
            type="date"
            {...register("deadline", { required: "Vui lòng chọn timeline" })}
            className="w-full rounded-lg border border-white/40 bg-transparent text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.deadline && <p className="text-red-400 text-sm mt-1">{errors.deadline.message}</p>}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-xl shadow-md hover:bg-blue-700 transition-colors"
        >
          Tạo Task
        </motion.button>
      </motion.form>
    </div>
  )
}

export default CreateTask
