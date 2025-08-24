import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import LayoutApp from "../../../layout";
import InputAuth from "../component/input";
import type { PropsSubTitleHomePage } from "../../../components/title-homepage/props-title-homepage";
import { useForm } from "react-hook-form";
import ButtonAuth from "../component/button";



const textFullName: PropsSubTitleHomePage = {
    text: 'Họ Tên',
    className: 'font-bold'
};

const textEmail: PropsSubTitleHomePage = {
    text: 'Email',
    className: 'font-bold'
};

const textPassword: PropsSubTitleHomePage = {
    text: 'Mật khẩu',
    className: 'font-bold'
};

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form className="flex flex-col space-y-2" onSubmit={handleSubmit((data) => console.log(data))}>
            {/* Fullname */}
            <InputAuth
                {...register('fullname', {
                    required: "Vui lòng nhập tên người dùng",
                    pattern: {
                        value: /^[A-Za-zÀ-ỹ\s]{2,50}$/,
                        message: "Tên chỉ được chứa chữ cái và khoảng trắng, từ 2–50 ký tự"
                    }
                })}
                error={errors.fullname?.message}
                label={textFullName}
                Icon={UserOutlined}
                type="text"
                placeholder="Nguyễn Văn A"
                className="text-white"
            />

            {/* Email */}
            <InputAuth
                {...register('email', {
                    required: "Vui lòng nhập email",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email không hợp lệ"
                    }
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
                {...register('password', {
                    required: "Vui lòng nhập mật khẩu",
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
                        message: "Mật khẩu cần 8–50 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
                    }
                })}
                error={errors.password?.message}
                label={textPassword}
                Icon={LockOutlined}
                type="password"
                className="text-white"
                placeholder="*********"

            />
            <ButtonAuth text="Đăng ký" className="w-full cursor-pointer"/>
        </form>
    );
}
