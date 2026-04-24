import { Router } from "express";
import GroupController from "../controllers/group.controllers.ts";
import { UserMiddleware } from "../middleware/user.middleware.ts";
import { GroupMiddleware } from "../middleware/group.middleware.ts";
import { upload } from "../third-party/upload-images/multer.ts";
import { router } from "./router.views.ts";
import userControllers from "../controllers/user.controllers.ts";
import groupControllers from "../controllers/group.controllers.ts";

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

routerGroup.patch(
    '/update/add-member',
    UserMiddleware.validateAutoLogin,
    GroupController.inviteJoinGroup
)
routerGroup.patch(
    '/update/verify-join-group',
    UserMiddleware.validateAutoLogin,
    GroupController.verifyJoinGroup
)
routerGroup.get('/info-group/:id_group',
    UserMiddleware.validateAutoLogin,
    GroupController.getInfoGroup
)
routerGroup.get(
    '/get-top-five-members-better/:id_group',
    UserMiddleware.validateAutoLogin,
    GroupController.topFiveMemberCompletedTaskMore
)
routerGroup.get(
    '/:id_group/members',
    UserMiddleware.validateAutoLogin,
    GroupController.getListMemberIngroupHasJoined
)
routerGroup.get(
    '/:id_group',
    UserMiddleware.validateAutoLogin,
    GroupController.getRoleMember
);
routerGroup.get(
    '/:id_group/members-not-joined',
    UserMiddleware.validateAutoLogin,
    GroupController.getListMemberIngroupHasNotJoined
)
routerGroup.patch(
    '/update/change-role-member',
    UserMiddleware.validateAutoLogin,
    GroupController.changeRoleMember
)
routerGroup.patch(
    '/update/change-role-confirmer',
    UserMiddleware.validateAutoLogin,
    GroupController.changeRoleConfirmer
)
routerGroup.patch(
    '/update/kick-member',
    UserMiddleware.validateAutoLogin,
    GroupController.kickMember
)
routerGroup.patch(
    '/update/leave-group',
    UserMiddleware.validateAutoLogin,
    GroupController.leaveGroup
)
routerGroup.delete(
    '/delete/:id_group',
    UserMiddleware.validateAutoLogin,
    GroupController.deleteGroup
)
routerGroup.get('/', (req: any, res: any) => {
    res.send('hello group')
})


export default routerGroup; // [SỬA] Dùng export default cho router