import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { PropsTask } from "../../api/props/task/create";


const option: { [key: string]: string } = {
  waiting: "bg-gray-100 text-gray-700 border border-gray-300",       // Nhạt, trung lập
  handling: "bg-blue-100 text-blue-700 border border-blue-300",      // Xanh làm việc
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",// Vàng cảnh báo
  completed: "bg-green-100 text-green-700 border border-green-300",  // Xanh hoàn thành
};



const ItemsGroup = ({ item, index }: { item: PropsTask, index: number }) => {
  const deadline = item.deadline ? new Date(`${item.deadline}`).getDate() + "-" + (Number(new Date(`${item.deadline}`).getMonth()) + 1) + "-" + new Date(`${item.deadline}`).getFullYear() : "Không có";

  return (
    <Link to={`views/${item._id}`} className={`${option[item.status]} relative rounded-md`}>
      <motion.div
        transition={{ duration: 0.35, delay: index * 0.1 }}
        className={`py-1 px-2 shadow-lg rounded-lg overflow-hidden`}>
        <h3 className="font-bold text-nowrap truncate">
          {item.task_name}
        </h3>
        <p className="text-xs space-x-1 capitalize text-nowrap ">
          <span>Deadline :</span>
          <span>{deadline}</span>
        </p>
      </motion.div>
    </Link>
  );
};

export default ItemsGroup;
