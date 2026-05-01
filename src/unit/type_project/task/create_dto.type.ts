export interface ITask {
  task_name: string;
  priority: 'thấp' | 'trung bình' | 'cao'; // Dùng union type cho chuẩn
  url: string;
  description: string;
  deadline: string; // Format: YYYY-MM-DD
  id_group: string;
}