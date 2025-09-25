import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9_]{3,20}$/  // chỉ cho chữ, số, _, dài 3-20 ký tự
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/  // regex email cơ bản,

    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/  
        // ít nhất 6 ký tự, gồm cả chữ và số
    },
    avatar: {
        type: String,
        match: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i  ,
        // link ảnh hợp lệ (http/https và có đuôi file ảnh)
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    verify: { 
        type: Boolean, 
        default: false 
    },
    listGroup: [
        { type: Schema.Types.ObjectId, ref: 'groups' }
    ]
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
  // chỉ hash khi password thay đổi hoặc mới tạo
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