import { Router } from "express";
import UserControllers from "../controllers/user.controllers"

import { UserMiddleware } from "../middleware/user.middleware";

const routerUser = Router();

routerUser.post('/create', UserMiddleware.validateRegister, UserControllers.create)
routerUser.post('/login', UserMiddleware.validateLogin, UserControllers.login)
routerUser.get('/auto-login', UserMiddleware.validateAutoLogin, UserControllers.autoLogin)
routerUser.get('/verify-email', UserMiddleware.validateAutoLogin, UserControllers.sendVerifyEmail)
routerUser.patch('/check-verify', UserMiddleware.validateAutoLogin, UserControllers.checkVerifyEmail)
// routerUser.post('/update/avatar', upload.single('avatar'), user.updateAvatar)
routerUser.get('/', (req: any, res: any) => {
    res.send('hello user')
})

export { routerUser }