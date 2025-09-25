import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";






class TaskMiddleware {
    private static _regexUsername = /^[a-zA-Z0-9._]{3,20}$/;
    static validateCreate = async (req: Request, res: Response, next: NextFunction) => {
        next();  
    }
    static validateGetViews = async (req: Request, res: Response, next: NextFunction) => {
        if(mongoose.Types.ObjectId.isValid(req.params.id_task)) next();
        else res.status(400).json({ valid: false, message: "ID task khong hop le" })
    }

}

export {
    TaskMiddleware
}