import { LockOutlined, MailOutlined } from "@ant-design/icons";
import InputAuth from "../component/input";
import { useForm } from "react-hook-form";
import ButtonAuth from "../component/button";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmitSignIn } from "./handle-submit";
import { useQueryClient } from "@tanstack/react-query";

const textEmail = {
  text: "Email",
  className: "font-bold",
};

const textPassword = {
  text: "Mật khẩu",
  className: "font-bold",
};

function SignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <form
      className="flex flex-col space-y-2"
      onSubmit={handleSubmit((data) => {
        handleSubmitSignIn(data, setError, navigate, queryClient);
      })}
    >
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
      <ButtonAuth text="Đăng nhập" className="w-full cursor-pointer" />
    </form>
  );
}

export default memo(SignIn);
