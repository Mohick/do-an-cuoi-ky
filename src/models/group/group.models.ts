import SchemaGroups from "./group.schema"

class GroupsModels {
    private _groupModel: typeof SchemaGroups

    constructor() {
        this._groupModel = SchemaGroups
    }

    create = async (
        name_project: string,
        creator: string,
        deadline: Date,
        image: {
            url: string
            public_image: string
            public_id: string
        },
        member: string
    ) => {
        try {

            
            await this._groupModel.create({
                name_project,
                creator,
                deadline,
                image,
                members: [member]
            })
            return { valid: true, message: "Thành công" }
        } catch (error) {
            console.error(error)
            return { valid: false, message: "Database error" }
        }
    }

    getGroup = async (id: string): Promise<{ valid: boolean; groups?: {
        _id: string 
        image: {
            url: string
            public_image: string
            public_id: string
        }
    }[]| any; message?: string }> => {
        try {
            const groups = await this._groupModel.find({
                members: { $in: [id] }
            })
            if (groups.length === 0) {
                return { valid: false, message: "Group not found" }
            }
            return { valid: true, groups }
        } catch (error) {
            console.error(error)
            return { valid: false, message: "Database error" }
        }
    }
}

export default GroupsModels
