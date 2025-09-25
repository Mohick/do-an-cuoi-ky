import { Router } from "express";
import { UserMiddleware } from "../middleware/user.middleware";
import { TaskMiddleware } from "../middleware/task.middleware";
import TaskControllers from "../controllers/task.controllers";

const routerTask = Router();
const task = new TaskControllers()

routerTask.post('/create', UserMiddleware.validateAutoLogin, TaskMiddleware.validateCreate, task.create)
routerTask.get('/views-task/:id_group', UserMiddleware.validateAutoLogin,TaskMiddleware.validateGetViews, task.getTasks)
routerTask.get('/', (req: any, res: any) => {
    res.send('hello user')
})

export { routerTask }