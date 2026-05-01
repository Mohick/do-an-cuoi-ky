
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";


class GroupMiddleware {
    private static regexNameProject = /^(?!(?:[\s\S]*<script|[\s\S]*javascript:|[\s\S]*on\w+=))(?!(?:\s*\S+\s+){50,})[\s\S]*$/i;
    static validateCreate = (req: Request, res: Response, next: NextFunction) => {
        const { name_project, deadline } = req.body;
        const deadlineTime = new Date(deadline).getTime();
        const currentTime = Date.now();
        const isNameInvalid = !this.regexNameProject.test(name_project);
        const isDeadlineInvalid = isNaN(deadlineTime) || deadlineTime < currentTime;
        const isFileMissing = !req.files || Object.keys(req.files).length === 0;
        if (isNameInvalid || isDeadlineInvalid || isFileMissing) {
            const details = {
                name_project: isNameInvalid ? "Tên dự án không hợp lệ hoặc chứa mã độc" : "",
                deadline: isDeadlineInvalid ? "Deadline phải lớn hơn thời gian hiện tại" : "",
                image: isFileMissing ? "Vui lòng tải lên file hình ảnh" : ""
            }
            res.status(400).send({
                valid: false,
                message: "" + details.name_project + details.deadline + details.image,

            });
            return;
        }
        next();
    }
    static validateGetGroup = (req: Request, res: Response, next: NextFunction) => {
        const { limit, page } = req.query;
        if (!limit || !page) {
            res.status(400).json({ valid: false, message: "Thieu limit hoac page" });
            return;
        }
        next();
    }
    static validateIDGroup = (req: Request, res: Response, next: NextFunction) => {
        const { id_group } = req.params;

        if (mongoose.Types.ObjectId.isValid(id_group)) { next() }
        else res.status(400).json({ valid: false, message: "ID người dung khong hop le" })
    }
    static validateInviteJoinGroup = (req: Request, res: Response, next: NextFunction) => {
        const { id_group } = req.params;
        const { userID } = req.body;
        if (mongoose.Types.ObjectId.isValid(id_group) && mongoose.Types.ObjectId.isValid(userID)) { next() }
        else res.status(400).json({ valid: false, message: "ID người dung khong hop le" })
    }
    static validateVerifyJoinGroup = (req: Request, res: Response, next: NextFunction) => {
        const { id_verify } = req.body;

        if (!id_verify.trim()) {
            res.status(400).json({ valid: false, message: "Thiếu mã xác thực." });
            return;
        }
        next();
    }
    static validateChangeRole = async (req: Request, res: Response, next: NextFunction) => {
        const { userID, id_group } = req.body;
        if (mongoose.Types.ObjectId.isValid(id_group) && mongoose.Types.ObjectId.isValid(userID)) { next() }
        else res.status(400).json({ valid: false, message: "ID task khong hop le" })
    }
    static validateLeaveGroup = async (req: Request, res: Response, next: NextFunction) => {
        const { id_group } = req.body;
        if (mongoose.Types.ObjectId.isValid(id_group)) { next() }
        else res.status(400).json({ valid: false, message: "ID task khong hop le" })
    }

}
export { GroupMiddleware }