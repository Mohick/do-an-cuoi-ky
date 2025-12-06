import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import type { PropsViewsTask } from "../../api/props/task/create";

const option: { [key: string]: string } = {
  // Trạng thái chờ: Nền xám nhạt, chữ xám đậm, viền trắng
  waiting: "bg-gray-700 text-gray-200 border border-gray-500", 
  // Trạng thái đang xử lý: Nền xanh lam nhạt, chữ xanh lam đậm, viền trắng
  handling: "bg-blue-800 text-blue-300 border border-blue-600",
  // Trạng thái đang chờ (pending): Nền vàng nhạt, chữ vàng đậm, viền trắng
  pending: "bg-yellow-800 text-yellow-300 border border-yellow-600",
  // Trạng thái hoàn thành: Nền xanh lá nhạt, chữ xanh lá đậm, viền trắng
  completed: "bg-green-800 text-green-300 border border-green-600",
};

const ItemsGroup = ({ item, index }: { item: PropsViewsTask; index: number }) => {
  const deadline = item.deadline
    ? `${new Date(item.deadline).getDate()}-${new Date(item.deadline).getMonth() + 1}-${new Date(item.deadline).getFullYear()}`
    : "Không có";

  return (
    <Link to={`views/${item._id}`}>
      <motion.div
        transition={{ duration: 0.35, delay: index * 0.1 }}
        className={`${option[item.status]} relative rounded-lg shadow-md p-3 cursor-pointer hover:scale-105 transform transition-all`}
      >
        <h3 className="font-bold truncate whitespace-nowrap">{item.task_name}</h3>
        <p className="text-xs mt-1 truncate whitespace-nowrap">
          <span className="font-medium">Deadline:</span> {deadline}
        </p>
      </motion.div>
    </Link>
  );
};

export default ItemsGroup;
