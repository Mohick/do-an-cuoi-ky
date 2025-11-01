import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

interface ComponentButtonProps {
    valid: boolean;
    onClick: () => void;
    name: string;
    // Bro có thể thêm các prop khác ở đây, ví dụ:
    // icon?: React.ReactNode;
    // variant?: 'primary' | 'danger';
}
export const ComponentButton = ({ valid, onClick, name }: ComponentButtonProps) => {

    // 4. Nếu valid, return button. Bỏ hoàn toàn logic ternary lặp
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${valid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-red-600 hover:bg-red-700"} text-white text-sm font-medium justify-center`}
        // Nếu bro muốn dùng các variant màu khác nhau:
        // className={`... ${variant === 'danger' ? 'bg-red-500' : 'bg-indigo-600'}`}
        >
            {valid ? <CheckCircleOutlined /> : <CloseOutlined />}
            {name}
        </motion.button>
    );
};
