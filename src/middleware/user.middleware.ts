
import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import mongoose from "mongoose";
declare module "express-serve-static-core" {
    interface Request {
        userID?: string; // hoặc number nếu là số
    }
}
class UserMiddleware {
    private static _regexUsername = /^[a-zA-Z0-9._]{3,20}$/;
    private static _regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    private static _regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    static validateRegister = (req: Request, res: Response, next: NextFunction) => {
        const { username, email, password } = req.body;
        const errors: Record<string, string> = {};
        if (!this._regexUsername.test(username)) errors.username = "Nhập sai Họ và Tên";
        if (!this._regexEmail.test(email)) errors.email = "Nhập sai Email";
        if (!this._regexPassword.test(password)) errors.password = "Nhập sai Mật khẩu";
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ valid: false, errors });
        }
        next();
    }
    static validateLogin = (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const errors: Record<string, string> = {};
        if (!this._regexEmail.test(email)
            ||
            !this._regexPassword.test(password)) errors.email = "Nhập sai Email Hoặc Mật khẩu";
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ valid: false, errors });
        }
        next();
    }
    static validateAutoLogin = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authorization } = req.headers;
            const token = authorization?.split(" ")[1];
            if (!token) {
                throw new Error("Thiếu token");
            }
            const hashToken = Jwt.verify(token, process.env.SECRET_KEY as string) as { id: string };            
            req.userID  = hashToken.id;
            if(mongoose.Types.ObjectId.isValid(hashToken.id)) return res.status(401).json({ valid: false, message: "Token không tồn tại hoặc không hợp lệ" });
            next();
        } catch (error) {
            return res.status(401).json({
                valid: false,
                message: "Token không tồn tại hoặc không hợp lệ",
            });
        }
    };

}
export { UserMiddleware }