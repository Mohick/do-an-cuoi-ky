import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { useParams } from "react-router-dom";
import { getManagerTaskAPI } from "../../../../api/group";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskData {
  fullSizeTasks: number;
  sizeTaskAwaiting: number;
  sizeTaskHandling: number;
  sizeTaskPending: number;
  sizeTaskCompleted: number;
}

interface ApiResponse {
  valid: boolean;
  message: string;
  lengthFullTask: TaskData;
}

const TASK_CONFIG = [
  {
    key: "sizeTaskAwaiting" as keyof TaskData,
    label: "Chưa làm",
    color: "rgba(255,185,0,0.75)",
    border: "#ffb900",
    badge: "bg-primary/12 text-primary border border-primary/22",
    bar: "bg-primary",
  },
  {
    key: "sizeTaskHandling" as keyof TaskData,
    label: "Đang làm",
    color: "rgba(59,130,246,0.75)",
    border: "#60a5fa",
    badge: "bg-[rgba(59,130,246,0.12)] text-blue-400 border border-[rgba(59,130,246,0.2)]",
    bar: "bg-blue-400",
  },
  {
    key: "sizeTaskPending" as keyof TaskData,
    label: "Chờ duyệt",
    color: "rgba(139,92,246,0.75)",
    border: "#a78bfa",
    badge: "bg-[rgba(139,92,246,0.12)] text-purple-400 border border-[rgba(139,92,246,0.2)]",
    bar: "bg-purple-400",
  },
  {
    key: "sizeTaskCompleted" as keyof TaskData,
    label: "Hoàn thành",
    color: "rgba(34,197,94,0.75)",
    border: "#4ade80",
    badge: "bg-[rgba(34,197,94,0.10)] text-green-400 border border-[rgba(34,197,94,0.2)]",
    bar: "bg-green-400",
  },
];

export default function CircleChart() {
  const { id_group } = useParams<{ id_group: string }>();
  const [dataTasks, setDataTasks] = useState<TaskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTasks, setHasTasks] = useState(true);

  useEffect(() => {
    if (!id_group) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getManagerTaskAPI({ id_group }) as { data: any };
        const apiData: ApiResponse = response.data;
        if (!apiData.valid || !apiData.lengthFullTask) throw new Error();
        setDataTasks(apiData.lengthFullTask);
        setHasTasks((apiData.lengthFullTask.fullSizeTasks || 0) > 0);
      } catch { setHasTasks(false); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [id_group]);

  const chartData = dataTasks
    ? {
        labels: TASK_CONFIG.map((c) => `${c.label} (${dataTasks[c.key]})`),
        datasets: [{
          data: TASK_CONFIG.map((c) => dataTasks[c.key]),
          backgroundColor: TASK_CONFIG.map((c) => c.color),
          borderColor: TASK_CONFIG.map((c) => c.border),
          borderWidth: 2,
        }],
      }
    : null;

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#1a1a2e",
        borderColor: "rgba(255,185,0,0.2)",
        borderWidth: 1,
        titleColor: "#f0f0f0",
        bodyColor: "#aaa",
        callbacks: {
          label: (item: TooltipItem<"pie">) => {
            const val = item.raw as number;
            const total = (item.chart.data.datasets[0].data as number[]).reduce((a, b) => a + (b || 0), 0);
            const pct = total ? ((val / total) * 100).toFixed(1) : 0;
            return ` ${item.label}: ${val} (${pct}%)`;
          },
        },
      },
    },
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-7 h-7 rounded-full border-2 border-primary/15 border-t-primary" />
        <p className="text-[12px] text-primary/40 uppercase tracking-[0.12em]">Đang tải...</p>
      </div>
    );

  if (!hasTasks || !dataTasks)
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <Loader size={20} className="text-white/20" />
        <p className="text-[13px] text-white/25 italic">Nhóm chưa có tác vụ nào.</p>
      </div>
    );

  const total = dataTasks.fullSizeTasks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-5 w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-[11px] uppercase tracking-[0.15em] text-primary/50">
          Trạng thái tác vụ
        </span>
        <div className="flex-1 h-px bg-primary/8" />
        <span className="text-[11px] bg-primary/12 text-primary border border-primary/20 rounded-full px-[9px] py-[2px]">
          {total} tổng
        </span>
      </div>

      {/* Pie chart */}
      <div className="w-[200px] sm:w-[240px] drop-shadow-[0_0_24px_rgba(255,185,0,0.08)]">
        <Pie data={chartData!} options={options} />
      </div>

      {/* Legend + progress bars */}
      <div className="w-full flex flex-col gap-[10px]">
        {TASK_CONFIG.map((cfg) => {
          const val = dataTasks[cfg.key] as number;
          const pct = total ? Math.round((val / total) * 100) : 0;
          return (
            <div key={cfg.key} className="flex items-center gap-3">
              {/* Label */}
              <span className={`text-[10px] font-semibold px-[8px] py-[2px] rounded-full uppercase tracking-[0.08em] flex-shrink-0 w-[90px] text-center ${cfg.badge}`}>
                {cfg.label}
              </span>

              {/* Bar */}
              <div className="flex-1 h-[5px] bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${cfg.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                />
              </div>

              {/* Value */}
              <div className="flex items-center gap-1 flex-shrink-0 w-[52px] justify-end">
                <span className="text-[12px] font-semibold text-[#e0e0e0]">{val}</span>
                <span className="text-[10px] text-white/25">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}