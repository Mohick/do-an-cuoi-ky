import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import type { ITask } from "../unit/type_project/task/create_dto.type";



class TaskMiddleware {
    private static regexNameTask = /^(?!(?:[\s\S]*<script|[\s\S]*javascript:|[\s\S]*on\w+=)).{3,50}$/i
    private static priority = ['thấp', 'trung bình', 'cao']
    private static regexUrl = /^(https?:\/\/[^\s]+)$/
    private static regexDescription = /^(?!(?:[\s\S]*<script|[\s\S]*javascript:|[\s\S]*on\w+=))[\s\S]{0,5000}$/i
    private static regexDeadline = /^(?!(?:[\s\S]*<script|[\s\S]*javascript:|[\s\S]*on\w+=))[\s\S]*$/i;
    static validateCreate = async (req: Request, res: Response, next: NextFunction) => {
        const { id_group, task_name, priority, url, description, deadline } = req.body as ITask;
        if (!mongoose.Types.ObjectId.isValid(id_group)) {
            return res.status(400).json({ valid: false, message: "ID group không hợp lệ" });
        }
        if (!this.priority.includes(priority)) {
            return res.status(400).json({ valid: false, message: "Mức độ ưu tiên không hợp lệ" });
        }
        if (!this.regexNameTask.test(task_name)) {
            return res.status(400).json({ valid: false, message: "Tên task không hợp lệ hoặc chứa ký tự cấm" });
        }
       if(url.trim() !== "" && !this.regexUrl.test(url)) {
            return res.status(400).json({ valid: false, message: "URL của task không hợp lệ hoặc chuae ký tự cấm" });
       }
        if (!this.regexDescription.test(description)) {
            return res.status(400).json({ valid: false, message: "Mota của task không hợp lệ hoặc chúa ký tự cấm" });
        }
        if (!this.regexDeadline.test(deadline)) {
            return res.status(400).json({ valid: false, message: "Deadline của task không hợp lệ hoặc chúa ký tự cấm" });
        }
        next();
    }
    static validatevalidateCommentTask = async (req: Request, res: Response, next: NextFunction) => {
        const { userID, id_task, comment, id_group } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id_group) || !mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ valid: false, message: "ID group không hợp lệ" });
        }
        if (!mongoose.Types.ObjectId.isValid(id_task)) {
            return res.status(400).json({ valid: false, message: "ID task não hợp lệ" });
        }
        if (!this.regexDescription.test(comment)) {
            return res.status(400).json({ valid: false, message: "Mota của task không hợp lệ hoặc chuae ký tự cấm" });
        }

        next();
    }
    static validateGetViews = async (req: Request, res: Response, next: NextFunction) => {
        if (mongoose.Types.ObjectId.isValid(req.params.id_group)) { next() }
        else res.status(400).json({ valid: false, message: "ID task khong hop le" })
    }
    static validateDelTask = async (req: Request, res: Response, next: NextFunction) => {
        const { id_task } = req.params;
        const { id_group } = req.query;
        if (mongoose.Types.ObjectId.isValid(id_task) && mongoose.Types.ObjectId.isValid(`${id_group}`)) { next() }
        else res.status(400).json({ valid: false, message: "ID task khong hop le" })
    }
    static validateUpdateTask = async (req: Request, res: Response, next: NextFunction) => {
        const { id_task, id_group } = req.body;
        if (mongoose.Types.ObjectId.isValid(id_task) && mongoose.Types.ObjectId.isValid(`${id_group}`)) { next() }
        else res.status(400).json({ valid: false, message: "ID task khong hop le" })
    }


}

export {
    TaskMiddleware
}