import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { set, useForm } from "react-hook-form";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import InputAuth from "../component/input";
import ButtonAuth from "../component/button";
import { handleSubmitRegister } from "./handle-submit";
import type { PropsSubTitleHomePage } from "../../home/components/title-homepage/props-title-homepage";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";

import { AnimatePresence } from "framer-motion";
import AlertFailseSignUp from "./models/alert-failse";
import AlertSuccessSignUp from "./models/alert-susscess";

const textusername: PropsSubTitleHomePage = {
  text: "Họ Tên",
  className: "font-bold",
};

const textEmail: PropsSubTitleHomePage = {
  text: "Email",
  className: "font-bold",
};

const textPassword: PropsSubTitleHomePage = {
  text: "Mật khẩu",
  className: "font-bold",
};

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  captchaToken: string;
};

export default function SignUp() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const password = watch("password");
  const [toggle, setToggle] = useState(false);
  const [alertMessage, setAlertMessage] = useState(true);
  console.log(alertMessage);
  
  return (
    <>
      <form
        className="flex flex-col space-y-2"
        onSubmit={handleSubmit(async (data: any) => handleSubmitRegister(data, setError, setToggle,setAlertMessage))}
      >
        {/* username */}
        <InputAuth
          {...register("username", {
            required: "Vui lòng nhập tên người dùng",
            pattern: {
              value: /^[A-Za-zÀ-ỹ\s]{2,50}$/,
              message:
                "Tên chỉ được chứa chữ cái và khoảng trắng, từ 2–50 ký tự",
            },
          })}
          error={errors.username?.message}
          label={textusername}
          Icon={UserOutlined}
          type="text"
          placeholder="Nguyễn Văn A"
          className="text-white"
        />

        {/* Email */}
        <InputAuth
          {...register("email", {
            required: "Vui lòng nhập email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không hợp lệ",
            },
          })}
          className="border-white text-white"
          error={errors.email?.message}
          label={textEmail}
          Icon={MailOutlined}
          type="email"
          placeholder="NQ3bI@example.com"
        />

        {/* Password */}
        <InputAuth
          {...register("password", {
            required: "Vui lòng nhập mật khẩu",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
              message:
                "Mật khẩu cần 8–50 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
            },
          })}
          error={errors.password?.message}
          label={textPassword}
          Icon={LockOutlined}
          type="password"
          className="text-white"
          placeholder="*********"
        />

        {/* Confirm Password */}
        <InputAuth
          {...register("confirmPassword", {
            required: "Vui lòng nhập lại mật khẩu",
            validate: (value) =>
              value === password || "Mật khẩu nhập lại không khớp",
          })}
          error={errors.confirmPassword?.message}
          label={{ text: "Xác nhận mật khẩu", className: "font-bold" }}
          Icon={LockOutlined}
          type="password"
          className="text-white"
          placeholder="*********"
        />

        {/* HCaptcha */}
        <HCaptcha
          sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY}
          size="normal"
          theme="dark"
          onVerify={(token) => {
            setValue("captchaToken", token, { shouldValidate: true });
          }}

        />
        <input
          type="hidden"
          {...register("captchaToken", {
            required: "Vui lòng xác minh captcha",
          })}
        />
        {errors.captchaToken && (
          <p className="text-red-500">{errors.captchaToken.message}</p>
        )}
        <ButtonAuth text="Đăng ký" className="w-full cursor-pointer" />

      </form>
      <AnimatePresence>
        {toggle && (
          alertMessage ? <AlertSuccessSignUp
            closeAlert={(valid: boolean) => setToggle(valid)}
          /> : <AlertFailseSignUp closeAlert={(valid: boolean) => setToggle(valid)} />
        )}
      </AnimatePresence>
    </>
  );
}
