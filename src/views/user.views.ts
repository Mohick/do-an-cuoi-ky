import { Router } from "express";
import { UserController } from "../controllers/user.controllers";

import { UserMiddleware } from "../middleware/user.middleware";

const routerUser = Router();
const user = new UserController()

routerUser.post('/create',UserMiddleware.validateRegister ,user.create)
routerUser.post('/login',UserMiddleware.validateLogin ,user.login)
routerUser.get('/auto-login',UserMiddleware.validateAutoLogin ,user.autoLogin)
routerUser.get('/verify-email',UserMiddleware.validateAutoLogin ,user.sendVerifyEmail)
routerUser.patch('/check-verify',UserMiddleware.validateAutoLogin ,user.checkVerifyEmail)
// routerUser.post('/update/avatar', upload.single('avatar'), user.updateAvatar)
routerUser.get('/', (req: any, res: any) => {
    res.send('hello user')
})

export { routerUser }