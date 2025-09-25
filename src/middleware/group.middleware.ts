
import type { Request, Response, NextFunction } from "express";


class GroupMiddleware {
    private static _regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    static validateCreate = (req: Request, res: Response, next: NextFunction) => {
        next();
    }
}
export { GroupMiddleware }