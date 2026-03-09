// Improved CircleChart.tsx
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

const TASK_COLORS = {
  TODO: "rgba(255, 206, 86, 0.6)",
  DOING: "rgba(54, 162, 235, 0.6)",
  PENDING: "rgba(153, 102, 255, 0.6)",
  COMPLETED: "rgba(75, 192, 192, 0.6)",
};

const TASK_BORDERS = {
  TODO: "rgba(255, 206, 86, 1)",
  DOING: "rgba(54, 162, 235, 1)",
  PENDING: "rgba(153, 102, 255, 1)",
  COMPLETED: "rgba(75, 192, 192, 1)",
};

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

        if (!apiData.valid || !apiData.lengthFullTask) {
          throw new Error("Invalid API data");
        }

        const taskData = apiData.lengthFullTask;
        const total = taskData.fullSizeTasks || 0;

        setDataTasks(taskData);
        setHasTasks(total > 0);
      } catch (err) {
        console.error(err);
        setHasTasks(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id_group]);

  const chartData = dataTasks
    ? {
      labels: [
        `Chưa làm (${dataTasks.sizeTaskAwaiting})`,
        `Đang làm (${dataTasks.sizeTaskHandling})`,
        `Chờ duyệt (${dataTasks.sizeTaskPending})`,
        `Đã hoàn thành (${dataTasks.sizeTaskCompleted})`,
      ],
      datasets: [
        {
          data: [
            dataTasks.sizeTaskAwaiting,
            dataTasks.sizeTaskHandling,
            dataTasks.sizeTaskPending,
            dataTasks.sizeTaskCompleted,
          ],
          backgroundColor: [
            TASK_COLORS.TODO,
            TASK_COLORS.DOING,
            TASK_COLORS.PENDING,
            TASK_COLORS.COMPLETED,
          ],
          borderColor: [
            TASK_BORDERS.TODO,
            TASK_BORDERS.DOING,
            TASK_BORDERS.PENDING,
            TASK_BORDERS.COMPLETED,
          ],
          borderWidth: 2,
        },
      ],
    }
    : null;

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Trạng thái tác vụ",
        font: { size: 18, weight: "bold" },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<"pie">) {
            const currentValue = tooltipItem.raw as number;
            const data = tooltipItem.chart.data.datasets[0].data;
            const total = data.reduce(
              (acc: any, val: any | any) => acc + (val || 0),
              0
            );
            const percent = total
              ? ((currentValue / total) * 100).toFixed(1)
              : 0;
            return `${tooltipItem.label}: ${currentValue} (${percent}%)`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return <div className="text-center p-4">Đang tải biểu đồ...</div>;
  }

  if (!hasTasks || !dataTasks) {
    return (
      <div className="text-center p-6 text-red-500 font-semibold">
        🚨 Nhóm chưa có tác vụ nào.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 p-4 animate-fadeIn">
      <div className="text-lg font-semibold text-blue-600">
        Tổng số tác vụ: {dataTasks.fullSizeTasks}
      </div>

      <div className="w-[260px] sm:w-[340px]">
        <Pie data={chartData!} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm mt-4">
        <LegendItem color={TASK_COLORS.TODO} label="Chưa làm" value={dataTasks.sizeTaskAwaiting} />
        <LegendItem color={TASK_COLORS.DOING} label="Đang làm" value={dataTasks.sizeTaskHandling} />
        <LegendItem color={TASK_COLORS.PENDING} label="Chờ duyệt" value={dataTasks.sizeTaskPending} />
        <LegendItem color={TASK_COLORS.COMPLETED} label="Hoàn thành" value={dataTasks.sizeTaskCompleted} />
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-sm" style={{ background: color }}></span>
      <span>
        {label} ({value})
      </span>
    </div>
  );
}