import { Router } from "express";
import { UserMiddleware } from "../middleware/user.middleware";
import { TaskMiddleware } from "../middleware/task.middleware";
import TaskControllers from "../controllers/task.controllers";

const routerTask = Router();
const task = TaskControllers

routerTask.post('/create', UserMiddleware.validateAutoLogin, TaskMiddleware.validateCreate, task.create)
routerTask.get('/:id_group/waiting', UserMiddleware.validateAutoLogin, TaskMiddleware.validateGetViews, task.GetTaskWaiting)
routerTask.patch('/comment-task', UserMiddleware.validateAutoLogin, task.commentInTask)
routerTask.patch('/update/claim-task', UserMiddleware.validateAutoLogin, task.claimTask)
routerTask.patch('/update/sendRequireVeryTask', UserMiddleware.validateAutoLogin, task.sendRequireVeryTask)
routerTask.patch('/update/completeTask', UserMiddleware.validateAutoLogin, task.completeTask)
routerTask.patch('/update/rollbackTask', UserMiddleware.validateAutoLogin, task.rollbackTask)
routerTask.patch('/update/rejectTask', UserMiddleware.validateAutoLogin, task.rejectTask)
routerTask.patch('/update/cancelTask', UserMiddleware.validateAutoLogin, task.cancelTask)
routerTask.get('/:id_group/getMyTask', UserMiddleware.validateAutoLogin, task.getFullMyTasks)
routerTask.get('/:id_group/getListPendingTask', UserMiddleware.validateAutoLogin, task.getListPendingTask)
routerTask.get('/:id_group/getListCompleteTask', UserMiddleware.validateAutoLogin, task.getListCompleteTask)
routerTask.delete('/delete/:id', UserMiddleware.validateAutoLogin, task.deleteTask)
routerTask.get('/', (req: any, res: any) => {
    res.send('hello user')
})

export { routerTask }