import type { NextFunction, Request, Response } from "express"

import TaskModels from "../models/task/task.models"


class TaskControllers {
    private _TasksModels: TaskModels
    constructor() {
        this._TasksModels = new TaskModels()
    }
    create = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { task_name, url, deadline, description, id_group } = req.body
            const id = req.userID as string
            const result = await this._TasksModels.create(id, task_name, deadline, url, description, id_group)
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
    getTasks = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.userID as string
            const { id_group } = req.params
            const result = await this._TasksModels.getTask(id, id_group)
            return res.status(result.valid ? 200 : 500).json(result) 
        } catch (error) {
            console.error(error)
            return res.status(500).json({ valid: false, message: "Internal server error" })
        }
    }

}



export default TaskControllers