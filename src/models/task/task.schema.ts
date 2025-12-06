import mongoose, { Schema } from "mongoose";
const taskSchema = new Schema(
    {
        task_name: {
            type: String,
            required: true,
            trim: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        url: {
            type: String,
        },
        description: {
            type: String,
        },
        deadline: {
            type: Date,
        },
        id_group: {
            type: Schema.Types.ObjectId,
            ref: "Group", // Tham chiếu đến schema 'Group'
            required: true,
        },
        comments: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "User",
                },
                message: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                alert: {
                    type: Boolean,
                    default: true,
                },
            },
        ],
        implementer: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        confirmer: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["waiting", "handling", "pending", "completed"],
            default: "waiting",
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;