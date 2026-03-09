import { useEffect, type FC, useState } from "react";
import { useAlert } from "./alert.hook";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const AlertComponent: FC = () => {
  const { listAlert, removeAlert } = useAlert() as  any

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {listAlert.map((alert:any) => (
        <AlertItem key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
      ))}
    </div>
  );
};

const AlertItem = ({ alert, onClose }: any) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const totalTime = 3000;
    const interval = 30;
    const step = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        if (next <= 0) {
          clearInterval(timer);
          onClose();
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onClose]);

  const getAlertStyle = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800";
      case "error":
        return "bg-red-100 border-red-400 text-red-800";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-800";
      case "info":
      default:
        return "bg-blue-100 border-blue-400 text-blue-800";
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div
      className={`relative overflow-hidden border-l-4 rounded-lg shadow-md p-4 w-72 transition-all duration-300 ${getAlertStyle(
        alert.status
      )}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {getIcon(alert.status)}
          <div>
            {alert.title && <p className="font-semibold text-sm">{alert.title}</p>}
            <p className="text-sm">{alert.message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          ×
        </button>
      </div>

      {/* timeline bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-200">
        <div
          className={`h-full ${
            alert.status === "success"
              ? "bg-green-500"
              : alert.status === "error"
              ? "bg-red-500"
              : alert.status === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
          } transition-all duration-100 linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export { AlertComponent };
