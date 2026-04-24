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
    },
    avatar: {
        type: {
            url: {
                type: String,
                required: true,
                match: [/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/, 'Please fill a valid image URL']
            },
            public_id: {
                type: String,
                required: true
            }
        },
        default: {
            url: '',
            public_id: '"https://res.cloudinary.com/deiuv1q6x/image/upload/v1777019097/uploads/nawqyk3wxcnp9161r8ol.jpg"'
        }
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio không được vượt quá 500 ký tự'],
        default: 'No thing about me',
        minlength: [10, 'Bio phải có ít nhất 10 ký tự']
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