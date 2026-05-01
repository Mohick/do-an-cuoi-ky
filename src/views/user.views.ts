import { Router } from "express";
import UserControllers from "../controllers/user.controllers"
import { UserMiddleware } from "../middleware/user.middleware";
import { upload } from "../third-party/upload-images/multer";
const routerUser = Router();
routerUser.post('/create', UserMiddleware.validateRegister, UserControllers.create)
routerUser.post('/login', UserMiddleware.validateLogin, UserControllers.login)
routerUser.get('/auto-login', UserMiddleware.validateAutoLogin, UserControllers.autoLogin)
routerUser.get('/verify-email', UserMiddleware.validateAutoLogin, UserControllers.sendVerifyEmail)
routerUser.patch('/check-verify', UserMiddleware.validateAutoLogin, UserControllers.checkVerifyEmail)
routerUser.get('/find-user-by-email', UserMiddleware.validateAutoLogin,UserMiddleware.validFindUserByEamail, UserControllers.findUserByEmail)
routerUser.patch('/update-account',upload.array('image[]'), UserMiddleware.validateAutoLogin, UserControllers.updateUser)
routerUser.patch('/update-bio', UserMiddleware.validateAutoLogin, UserControllers.updateBio)
routerUser.get('/', (req: any, res: any) => {
    res.send('hello user')
})

export { routerUser }