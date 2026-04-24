import { CloseCircleOutlined, MailOutlined, UserOutlined, KeyOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons"
import { Link, useOutletContext } from "react-router-dom"
import InputAuth from "../../auth/component/input"
import { useState } from "react";
import { useForm } from "react-hook-form"; // Import khứa này
import type { UserInterface } from "./account";
import { motion } from "framer-motion";
import { handleUpdate } from "./handle_account.update";

const getImg = (target: HTMLInputElement) => {
    const file = target.files?.[0] ?? null;
    if (!file) return "";
    return URL.createObjectURL(file);
}

const EditAccount = () => {
 
    const user: UserInterface = useOutletContext();
    const [preview, setPreview] = useState<string>(user.avatar.url);
    const [file, setFile] = useState<File | null>(null);
    // 1. Khởi tạo Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: user.username,
            email: user.email,
            password: "",
            newPassword: "",
            image: null as File | null,
        }
    });

    const onSubmit = (data: any) => {
        data.image = [file]
    
        
        handleUpdate(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, type: "spring" }}

            className="fixed flex items-center justify-center z-50 top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm">
            <div className="rounded-xl bg-[#1e2939] gap-5 space-y-5 p-6 w-full max-w-[500px] border border-slate-700 shadow-2xl">

                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                    <h2 className="text-xl font-bold text-white">Chỉnh sửa Profile</h2>
                    <Link to={'/dashboard/account'} className="text-slate-400 hover:text-red-400 transition-colors">
                        <CloseCircleOutlined style={{ fontSize: '20px' }} />
                    </Link>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}  className="space-y-6">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Phần Avatar */}
                        <div className="col-span-12 flex justify-center">
                            <div className="relative group h-24 w-24 overflow-hidden border-2 border-dashed border-amber-200/50 rounded-full hover:border-amber-400 transition-all">
                                <label htmlFor="portforlio_avatar-edit" className="cursor-pointer">
                                    <img src={preview || "/default-avatar.png"} alt="preview" className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] text-white font-medium">Đổi ảnh</span>
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    onChange={async (e) => {
                                        setPreview(getImg(e.target))
                                        setFile(e.target.files?.[0] ?? null)
                                    }}
                                    name="image"
                                    id="portforlio_avatar-edit"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Phần Inputs */}
                        <div className="col-span-12 flex flex-col gap-4">
                            <div>
                                <InputAuth
                                    type="text"
                                    Icon={UserOutlined}
                                    label={{ text: "Username", className: "text-amber-50" }}
                                    {...register("username", { required: "Username không được để trống" })}
                                />
                                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
                            </div>

                            <div>
                                <InputAuth
                                    type="email"
                                    Icon={MailOutlined}
                                    label={{ text: "Email", className: "text-amber-50" }}
                                    {...register("email", {
                                        required: "Email là bắt buộc",
                                        pattern: { value: /^\S+@\S+$/i, message: "Email không đúng định dạng" }
                                    })}
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputAuth
                                        Icon={KeyOutlined}
                                        type="password"
                                        label={{ text: "Mật khẩu cũ", className: "text-amber-50 text-xs" }}
                                        placeholder="••••••••"
                                        {...register("password")}
                                    />
                                </div>
                                <div>
                                    <InputAuth
                                        Icon={KeyOutlined}
                                        type="password"
                                        label={{ text: "Mật khẩu mới", className: "text-amber-50 text-xs" }}
                                        placeholder="••••••••"
                                        {...register("newPassword", { minLength: { value: 6, message: "Tối thiểu 6 ký tự" } })}
                                    />
                                    {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Button Group */}
                    <div className="flex gap-3 pt-4 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={() => { reset(); setPreview(user.avatar.url); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all text-sm"
                        >
                            <ReloadOutlined /> Reset
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-[#1e2939] font-bold transition-all text-sm"
                        >
                            <SaveOutlined /> Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default EditAccount;