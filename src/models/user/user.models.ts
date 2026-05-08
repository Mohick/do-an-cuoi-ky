
import { storeRedis } from "../../third-party/redis/redis";
import { templateEmailVerifyAccount } from "../../third-party/send-email/template-send-verify-email";
import SchemaUser from "./user.schema";
import bcrypt from "bcrypt";
class UserModels {
    async create(email: string, password: string, username: string):
        Promise<{ valid: boolean; user?: any; message?: string }> {
        try {
            const user = await SchemaUser.create({ email, password, username });
            return { valid: true, user };
        } catch (error: any) {
            if (error.code === 11000) { // duplicate key error Mongo
                return { valid: false, message: "Email đã tồn tại" };
            }
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async login(email: string, password: string): Promise<{ valid: boolean; user?: any; message?: string }> {
        try {
            const user = await SchemaUser.findOne({ email });
            if (!user) return { valid: false, message: "Email hoặc password bị sai" };
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return { valid: false, message: "Email hoặc password bị sai" };
            return { valid: true, user, message: "Thành công" };
        } catch (error: any) {
            console.log(error);
            return { valid: false, message: "Email hoặc password bị sai" };
        }
    }
    async findUserById(id: string): Promise<{ valid: boolean; user?: any; message?: string }> {
        try {
            const user = await SchemaUser.findById(id);
            if (!user) return { valid: false, message: "Không tìm thấy user" };
            return { valid: true, user: user.toObject(), message: "Thành công" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async setVerifyEmail(userId: string): Promise<{ valid: boolean; message?: string }> {
        try {
            console.time();

            const key = btoa(userId + "verify");
            if (!await storeRedis.get(key)) {
                const user = await SchemaUser.findById(userId);
                if (user) {
                    const url = process.env.CLI_URL + '/verify-email/' + key;
                    await templateEmailVerifyAccount(user?.email || "", url);
                    await storeRedis.set(key, "verify", { EX: 60 * 5 }); // 5 phút
                }
            }
            console.timeEnd();
            if (await storeRedis.get(key)) {
                return { valid: true, message: "Thành công" };
            } else {
                return { valid: false, message: "Gửi verify thất bại" };
            }

        } catch (error: any) {
            return { valid: false, message: error.message || "Redis error khi set token" };
        }
    }

    async hasVerifyEmail(userID: string, key: string): Promise<{ valid: boolean; message?: string, user?: any }> {
        try {
            const token = await storeRedis.get(key.trim());
            if (token) {
                const user = await SchemaUser.findOneAndUpdate({ _id: userID }, { verify: true }, { new: true });
                await storeRedis.del(key.trim())
                await storeRedis.set("verified_users", userID, { EX: 60 * 60 * 24 }) // 1 ngày;

                return { valid: true, message: "Thành công", user: user?.toObject() };
            }
            return { valid: false, message: "Chưa xác thực email" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Redis error khi get token" };
        }
    }
    async findUserByEmail(email: string): Promise<{ valid: boolean; user?: any; message?: string }> {
        try {
            const user = await SchemaUser.findOne({ email });
            if (!user) return { valid: false, message: "Không tìm thấy user" };
            return { valid: true, user: user, message: "Thành công" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async updateUser(userId: string, data: { username?: string, password?: string, avatar?: { url: string, public_id: string }, newPassword?: string }): Promise<{ valid: boolean; message?: string, avatar_public_id?: string, user?: any }> {
        try {
            const user = await SchemaUser.findById(userId);
            if (!user) return { valid: false, message: "Không tìm thấy user" };

            const oldURLImg = user.avatar?.public_id as string || "";
            const isMatch = await bcrypt.compare(data.password || "", user.password);
            if (!isMatch) {
                return { valid: false, message: "Mật khẩu cũ không đúng" };
            }
            if (data.username) user.username = data.username;
            if (data.avatar) user.avatar = data.avatar;
            if (data.newPassword) {
                user.password = data.newPassword;
            }
            const result = await user.save({ validateBeforeSave: false });

            return {
                valid: true,
                message: "Thành công",
                avatar_public_id: data.avatar?.public_id ? oldURLImg : undefined,
                user: result.toObject()
            };

        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async updateBio(userId: string, bio: string): Promise<{ valid: boolean; message?: string, user?: any }> {
        try {
            const user = await SchemaUser.findOneAndUpdate({ _id: userId }, { bio }, { new: true });
            if (!user) return { valid: false, message: "Không tìm thấy user" };
            return { valid: true, message: "Thành công", user: user };
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
}

export default new UserModels();
