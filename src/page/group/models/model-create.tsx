"use client"

import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { handleCreateTask } from "./handle-create"
import type { PropsCreateTask } from "../../../api/props/task/create"
import { X, FilePlus, Link2, AlignLeft, CalendarDays, Flag } from "lucide-react"
import { useState } from "react"

const inputClass = `
  w-full bg-[#1c2840] border border-[rgba(255,255,255,0.07)] rounded-[10px]
  px-4 py-[10px] text-[13px] text-[#e0e0e0] placeholder:text-white/20
  outline-none focus:border-primary/35 focus:bg-[#1e2d47]
  transition-colors duration-200
`

// 1. CHỈ CÓ 1 REGEX CHỐNG XSS DÙNG CHUNG CHO TOÀN FORM
const ANTI_XSS_REGEX = /^(?!(?:[\s\S]*<script|[\s\S]*javascript:|[\s\S]*on\w+=))[\s\S]*$/i;

const CreateTask = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PropsCreateTask>({
    mode: "onChange" // Bật cái này lên để gõ tới đâu validate tới đó
  })
  const { id_group } = useParams()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async (data: PropsCreateTask) => {
    setSubmitError(null)
    try {
      await handleCreateTask(data, id_group as string)
      reset()
      navigate(-1)
    } catch(error) {
      
      setSubmitError("Tạo task thất bại, vui lòng kiểm tra lại kết nối.")
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        className="relative w-full max-w-xl bg-app border border-primary/12 rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-dark to-primary" />

        <div className="px-5 pt-5 pb-4 border-b border-primary/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FilePlus size={14} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#f0f0f0]">Tạo nhiệm vụ</h2>
              <p className="text-[10px] text-white/25 mt-0.5">Điền thông tin chi tiết bên dưới</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate(-1)} className="w-7 h-7 rounded-full border border-primary/20 bg-primary/6 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors">
            <X size={13} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">

            {/* Tên task */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.1em] text-primary/55 mb-2">
                Tên Task <span className="text-red-400/60">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Thiết kế UI..."
                {...register("task_name", {
                  required: "Tên task là bắt buộc",
                  validate: {
                    noXss: (value) => ANTI_XSS_REGEX.test(value) || "Phát hiện ký tự nguy hiểm!",
                    checkLength: (value) => (value.length >= 3 && value.length <= 50) || "Yêu cầu từ 3 đến 50 ký tự"
                  }
                })}
                className={inputClass}
              />
              {errors.task_name && <p className="text-red-400/70 text-[10px] mt-1.5">{errors.task_name.message}</p>}
            </div>

            {/* Ưu tiên */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.1em] text-primary/55 mb-2 flex items-center gap-1.5">
                <Flag size={10} /> Ưu tiên
              </label>
              <div className="relative">
                <select
                  {...register("priority", { required: "Vui lòng chọn mức ưu tiên" })}
                  className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                >
                  <option value="thấp">Thấp</option>
                  <option value="trung bình">Trung bình</option>
                  <option value="cao">Cao</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-2">
                  <X size={10} className="text-primary rotate-45" />
                </div>
              </div>
              {errors.priority && <p className="text-red-400/70 text-[10px] mt-1.5">{errors.priority.message}</p>}
            </div>

            {/* URL */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.1em] text-primary/55 mb-2 flex items-center gap-1.5">
                <Link2 size={10} /> Đường dẫn (URL)
              </label>
              <input
                type="text"
                placeholder="https://..."
                {...register("url", {
                  validate: {
                    isUrl: (value) => !value || /^(https?:\/\/[^\s]+)$/.test(value) || "Định dạng URL không hợp lệ"
                  }
                })}
                className={inputClass}
              />
              {errors.url && <p className="text-red-400/70 text-[10px] mt-1.5">{errors.url.message}</p>}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.1em] text-primary/55 mb-2 flex items-center gap-1.5">
                <CalendarDays size={10} /> Deadline <span className="text-red-400/60">*</span>
              </label>
              <input
                type="date"
                datatype="UTC"
                {...register("deadline", {
                  required: "Vui lòng chọn ngày",
                  validate: {
                    noXss: (value) => ANTI_XSS_REGEX.test(value) || "Dữ liệu ngày không hợp lệ",
                    isFuture: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || "Deadline đã qua rồi mà bro";
                    }
                  }
                })}
                className={`${inputClass} [color-scheme:dark] cursor-pointer`}
              />
              {errors.deadline && <p className="text-red-400/70 text-[10px] mt-1.5">{errors.deadline.message}</p>}
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.1em] text-primary/55 mb-2 flex items-center gap-1.5">
              <AlignLeft size={10} /> Mô tả nhiệm vụ
            </label>
            <textarea
              {...register("description", {
                validate: {
                  noXss: (value) => !value || ANTI_XSS_REGEX.test(value) || "Mô tả chứa ký tự nguy hiểm!",
                  maxLength: (value) => !value || value.length <= 5000 || "Mô tả không được vượt quá 5000 ký tự"
                }
              })}
              rows={4}
              placeholder="Nhập chi tiết công việc..."
              className={`${inputClass} resize-none w-full`}
            />
            {errors.description && <p className="text-red-400/70 text-[10px] mt-1.5">{errors.description.message}</p>}
          </div>

          {submitError && (
            <p className="text-red-400/90 text-[11px] text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{submitError}</p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-[10px] text-[13px] font-bold transition-all mt-2
              ${isSubmitting
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-primary/12 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50"
              }`}
          >
            {isSubmitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN TẠO TASK"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateTask