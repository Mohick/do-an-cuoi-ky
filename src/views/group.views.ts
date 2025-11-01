import { Router } from "express";
import GroupController from "../controllers/group.controllers.ts";
import { UserMiddleware } from "../middleware/user.middleware.ts";
import { GroupMiddleware } from "../middleware/group.middleware.ts";
import { upload } from "../third-party/upload-images/multer.ts";
import { router } from "./router.views.ts";

const routerGroup = Router();


routerGroup.post(
    '/create', 
    UserMiddleware.validateAutoLogin, 
    upload.array('image[]'),
    GroupMiddleware.validateCreate, 
    GroupController.createGroup
);
routerGroup.get(
    '/', 
    UserMiddleware.validateAutoLogin, 
    GroupController.getMyGroups
)
routerGroup.get(
    '/:id_group', 
    UserMiddleware.validateAutoLogin, 
    GroupController.getRoleMember
);


// Route test, có thể xóa khi deploy
routerGroup.get('/hello', (req: any, res: any) => {
    res.send('Hello from Group Router!');
});

export default routerGroup; // [SỬA] Dùng export default cho router