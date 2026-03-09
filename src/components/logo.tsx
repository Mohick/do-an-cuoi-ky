import { motion } from "framer-motion";

export default function Logo() {
    return (
        <motion.svg
            width="220"
            height="54"
            viewBox="0 0 220 54"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="8" y="8" width="38" height="38" rx="8" fill="white" />
            <text x="13" y="35" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#0F172A">
                TM
            </text>
            <text x="56" y="35" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="white">
                Task Manager
            </text>
        </motion.svg>
    );
}
