import type { NextFunction, Request, Response } from "express"
import GroupsModels from "../models/group/group.models"
import { cloudinary } from "../third-party/upload-images/multer"
import fs from "fs"





class GroupController {
    private _groupsModels: GroupsModels
    constructor() {
        this._groupsModels = new GroupsModels()
    }
    create = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { name_project, creator, deadline, avatar } = req.body
            const id = req.userID as string
            const file = (req.files as any[])[0]
            const resulta = await cloudinary.uploader.upload(file.path)
            fs.unlinkSync(file.path)
            const image = {
                url: resulta.secure_url,
                public_image: resulta.public_id,
                public_id: resulta.public_id
            }
            const result = await this._groupsModels.create(
                name_project,
                creator,
                new Date(deadline),
                image,
                id
            )
            if (result.valid) {
                return res.status(201).json({ valid: true, message: result.message })
            } else {
                return res.status(500).json({ valid: false, message: result.message })
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({ valid: false, message: "Internal server error" })
        }
    }

    getGroups = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.userID as string
            const groups = await this._groupsModels.getGroup(id)
            const showList: {
                _id: string,
                name_project: string,
                creator: string,
                deadline: Date,
                image: string,
                createdAt?: Date,
                status?: string

            }[] = []

            groups.groups.forEach((group: any) => {
                showList.push({
                    _id: group._id,
                    name_project: group.name_project,
                    creator: group.creator,
                    deadline: group.deadline,
                    image: group.image.url,
                    createdAt: group.createdAt,
                    status: group.status
                })
            })
            const working = showList.filter((group: any) => group.status === "đang hoạt động")
            const done = showList.filter((group: any) => group.status === "đã hoàn thành")
            const cancel = showList.filter((group: any) => group.status === "đã hủy")
            return res.status(200).json({ valid: true, working, done, cancel })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ valid: false, message: "Internal server error" })
        }
    }

}



export default GroupController