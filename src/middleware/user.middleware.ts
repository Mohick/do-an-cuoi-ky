import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import mongoose from "mongoose";
declare module "express-serve-static-core" {
  interface Request {
    userID?: string; // hoặc number nếu là số
    resetToken?: boolean;
  }
}
class UserMiddleware {
  private static _regexUsername =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_]{4,50}$/u;
  private static _regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  private static _regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  static validateRegister = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { username, email, password } = req.body;
    const errors: Record<string, string> = {};
    if (!this._regexUsername.test(username))
      errors.username = "Nhập sai Họ và Tên";
    if (!this._regexEmail.test(email)) errors.email = "Nhập sai Email";
    if (!this._regexPassword.test(password))
      errors.password = "Nhập sai Mật khẩu";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ valid: false, errors });
    }
    next();
  };
  static validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const errors: Record<string, string> = {};
    if (!this._regexEmail.test(email) || !this._regexPassword.test(password))
      errors.email = "Nhập sai Email Hoặc Mật khẩu";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ valid: false, errors });
    }
    next();
  };
  static validateAutoLogin = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { authorization } = req.headers;
      const token = authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Thiếu token");
      }
      const hashToken = Jwt.verify(token, process.env.SECRET_KEY as string) as {
        id: string;
        exp: number;
      };
      req.userID = hashToken.id;
      const THREE_DAYS_IN_SECONDS = 3 * 24 * 60 * 60;
      const currentTime = Math.floor(Date.now() / 1000);
      req.resetToken = hashToken.exp - currentTime <= THREE_DAYS_IN_SECONDS;
      if (!mongoose.Types.ObjectId.isValid(hashToken.id))
        return res.status(401).json({
          valid: false,
          message: "Token không tồn tại hoặc không hợp lệ",
        });
      next();
    } catch (error) {
      return res.status(401).json({
        valid: false,
        message: "Token không tồn tại hoặc không hợp lệ",
      });
    }
  };
  static validFindUserByEamail = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { email } = req.query;
    const errors: Record<string, string> = {};
    if (!this._regexEmail.test(email as string))
      errors.email = "Nhập sai Email";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ valid: false, errors });
    }
    next();
  };
  static validFindUserByUsername = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { username } = req.query;
    const errors: Record<string, string> = {};
    if (!this._regexUsername.test(username as string))
      errors.username = "Nhập sai Họ và Tên";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ valid: false, errors });
    }
    next();
  };
  static validUpdateAccount = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { username, password, email, newPassword } = req.body;
    const errors: Record<string, string> = {};
    if (username && !this._regexUsername.test(username))
      errors.username = "Nhập sai Họ và Tên";
    if (email && !this._regexEmail.test(email)) errors.email = "Nhập sai Email";
    if (password && !this._regexPassword.test(password))
      errors.password = "Nhập sai Mật khẩu";
    if (newPassword) {
      if (!this._regexPassword.test(newPassword))
        errors.newPassword = "Nhập sai Mật khẩu mới";
      else if (password && newPassword && password === newPassword)
        errors.newPassword = "Mật khẩu mới không được trùng với mật khẩu cũ";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ valid: false, errors });
    }
    next();
  };
}
export { UserMiddleware };
