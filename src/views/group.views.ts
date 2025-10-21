import { Router } from "express";
import GroupController from "../controllers/group.controllers.ts";
import { UserMiddleware } from "../middleware/user.middleware.ts";
import { GroupMiddleware } from "../middleware/group.middleware.ts";
import { upload } from "../third-party/upload-images/multer.ts";

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
);

routerGroup.patch(
    '/:id/status',
    UserMiddleware.validateAutoLogin,
    GroupController.updateGroupStatus
);

routerGroup.delete(
    '/:id',
    UserMiddleware.validateAutoLogin,
    GroupController.deleteGroup
);


// Route test, có thể xóa khi deploy
routerGroup.get('/hello', (req: any, res: any) => {
    res.send('Hello from Group Router!');
});

export default routerGroup; // [SỬA] Dùng export default cho router