import { Router } from "express";

import { UserMiddleware } from "../middleware/user.middleware";
import GroupController from "../controllers/group.controllers";
import { GroupMiddleware } from "../middleware/group.middleware";
import { upload } from "../third-party/upload-images/multer";
const routerGroup = Router();
const group = new GroupController()

routerGroup.post('/create', UserMiddleware.validateAutoLogin,upload.array('image[]'), GroupMiddleware.validateCreate, group.create)
routerGroup.get('/views-group', UserMiddleware.validateAutoLogin, group.getGroups)
routerGroup.get('/', (req: any, res: any) => {
    res.send('hello user')
})

export { routerGroup }