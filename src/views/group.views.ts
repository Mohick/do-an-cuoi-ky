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
)

routerGroup.patch(
    '/update/add-member',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateInviteJoinGroup,
    GroupController.inviteJoinGroup
)
routerGroup.patch(
    '/update/verify-join-group',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateVerifyJoinGroup,
    GroupController.verifyJoinGroup
)
routerGroup.get('/info-group/:id_group',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateIDGroup,
    GroupController.getInfoGroup
)
routerGroup.get(
    '/get-top-five-members-better/:id_group',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateIDGroup,
    GroupController.topFiveMemberCompletedTaskMore
)
routerGroup.get(
    '/:id_group/members',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateIDGroup,
    GroupController.getListMemberIngroupHasJoined
)
routerGroup.get(
    '/:id_group',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateIDGroup,
    GroupController.getRoleMember
);
routerGroup.get(
    '/:id_group/members-not-joined',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateIDGroup,
    GroupController.getListMemberIngroupHasNotJoined
)
routerGroup.patch(
    '/update/change-role-member',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateChangeRole,
    GroupController.changeRoleMember
)
routerGroup.patch(
    '/update/change-role-confirmer',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateChangeRole,
    GroupController.changeRoleConfirmer
)
routerGroup.patch(
    '/update/change-role-leader',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateChangeRole,
    GroupController.changeRoleLeader
)
routerGroup.patch(
    '/update/kick-member',
    UserMiddleware.validateAutoLogin,
    GroupMiddleware.validateChangeRole,
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
    GroupMiddleware.validateIDGroup,
    GroupController.deleteGroup
)

export default routerGroup; 