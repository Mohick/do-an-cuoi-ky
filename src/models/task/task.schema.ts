import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    task_name: {
        type: String,
        required: true,
        trim: true,
    },
    creator: {
        type: String, // Hoặc ObjectId nếu liên kết với User
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group", // nếu có schema Group
        required: true,
    },
    comments: {
        type: [
            {
                user: {
                    type: String, // có thể đổi sang ObjectId nếu liên kết với User
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        default: [],
        status: {
            type: String,
            enum: ["waiting", "handling", "pending",'completed'],
            default: "waiting",
        }
    },
}, {
    timestamps: true,
});

const SchemaTask = mongoose.model("Task", taskSchema);
export default SchemaTask;
