import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/
        // ít nhất 6 ký tự, gồm cả chữ và số
    },
    avatar: {
        type: String,
        match: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    notification: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Task"
        }],
        default: []
    },
    verify: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUND_SALT))
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (err) {
        next(err as any)
    }
})
const SchemaUser = mongoose.model('User', userSchema)
export default SchemaUser