import SchemaGroups from "../group/group.schema"
import SchemaUser from "../user/user.schema"
import SchemaTask from "./task.schema"








class TaskModels {
    private _taskSchema: typeof SchemaTask
    private _userSchema: typeof SchemaUser
    private _groupSchema: typeof SchemaGroups
    constructor() {
        this._taskSchema = SchemaTask
        this._userSchema = SchemaUser
        this._groupSchema = SchemaGroups

    }
    checkRole = async (id_user: string, id_group: string): Promise<{ valid: boolean; message?: string }> => {

        try {
            const [user, group] = await Promise.all([
                await this._userSchema.findById(id_user),
                await this._groupSchema.findById(id_group)
            ]
            )
            if (!user || !group) {
                return { valid: false, message: "User or group not found" }
            }
            if (!group.members.includes(id_user)) {
                return { valid: false, message: "User not in group" }
            }
            return (
                { valid: true, message: "Thành công" }
            )
        } catch (error) {
            console.error(error)
            return { valid: false, message: "Database error" }
        }
    }
    create = async (
        creatorID: string,
        task_name: string,
        deadline: Date,
        url: string,
        description: string,
        id_group: string
    ) => {
        try {
            const result = await this.checkRole(creatorID, id_group)
            if (!result.valid) {
                return result
            }
            await this._taskSchema.create({
                task_name,
                creator: creatorID,
                deadline,
                url,
                description,
                id_group
            })
            return { valid: true, message: "Thành công" }
        } catch (error) {
            console.error(error)
            return { valid: false, message: "Database error" }
        }
    }

    getTask = async (id_group: string, id_user: string): Promise<{
        valid: boolean; awaitingTask?: any; handlingTask?: any; spendingTask?: any; completedTask?: any, message?: string
    }> => {
        try {
            const result = await this.checkRole(id_user, id_group)
            if (!result.valid) {
                return result
            }
            const Task = await this._taskSchema.find({ id_group })
            const awaitingTask = Task.filter((task: any) => task.status === "awaiting");
            const handlingTask = Task.filter((task: any) => task.status === "handling");
            const spendingTask = Task.filter((task: any) => task.status === "spending");
            const completedTask = Task.filter((task: any) => task.status === "completed");
            return { valid: true, awaitingTask, handlingTask, spendingTask, completedTask, message: "Thành công" }
        } catch (error) {
            console.error(error)
            return { valid: false, message: "Database error" }
        }
    }
}

export default TaskModels
