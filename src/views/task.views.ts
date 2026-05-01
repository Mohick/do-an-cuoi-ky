import { Router } from "express";
import { UserMiddleware } from "../middleware/user.middleware";
import { TaskMiddleware } from "../middleware/task.middleware";
import TaskControllers from "../controllers/task.controllers";

const routerTask = Router();
const task = TaskControllers

routerTask.post('/create', UserMiddleware.validateAutoLogin, TaskMiddleware.validateCreate, task.create)
routerTask.get('/:id_group/waiting', UserMiddleware.validateAutoLogin, TaskMiddleware.validateGetViews, task.GetTaskWaiting)
routerTask.patch('/comment-task', UserMiddleware.validateAutoLogin,TaskMiddleware.validatevalidateCommentTask, task.commentInTask)
routerTask.patch('/update/claim-task', UserMiddleware.validateAutoLogin,TaskMiddleware.validateUpdateTask, task.claimTask)
routerTask.patch('/update/sendRequireVeryTask', UserMiddleware.validateAutoLogin,TaskMiddleware.validateUpdateTask, task.sendRequireVeryTask)
routerTask.patch('/update/completeTask', UserMiddleware.validateAutoLogin,TaskMiddleware.validateUpdateTask, task.completeTask)
routerTask.patch('/update/rollbackTask', UserMiddleware.validateAutoLogin,TaskMiddleware.validateUpdateTask, task.rollbackTask)
routerTask.patch('/update/rejectTask', UserMiddleware.validateAutoLogin,TaskMiddleware.validateUpdateTask, task.rejectTask)
routerTask.patch('/update/cancelTask', UserMiddleware.validateAutoLogin,TaskMiddleware.validateUpdateTask, task.cancelTask)
routerTask.get('/:id_group/getMyTask', UserMiddleware.validateAutoLogin, TaskMiddleware.validateGetViews, task.getFullMyTasks)
routerTask.get('/:id_group/getListPendingTask', UserMiddleware.validateAutoLogin, TaskMiddleware.validateGetViews, task.getListPendingTask)
routerTask.get('/:id_group/getListCompleteTask', UserMiddleware.validateAutoLogin, TaskMiddleware.validateGetViews, task.getListCompleteTask)
routerTask.delete('/delete/:id_task', UserMiddleware.validateAutoLogin,TaskMiddleware.validateDelTask, task.deleteTask)
routerTask.get('/', (req: any, res: any) => {
    res.send('hello user')
})

export { routerTask }