
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
            user.password = "";
            user.avatar = {
                url: user.avatar.url,
                public_id: ''
            };
            return { valid: true, user, message: "Thành công" }
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async updateAvatar(userId: string, avatar: string):
        Promise<{ valid: boolean; message?: string }> {
        try {
            const user = await SchemaUser.findOneAndUpdate({ _id: userId }, { avatar }, { new: true });
            if (!user) return { valid: false, message: "Không tìm thấy user" };
            return { valid: true, message: "Thành công" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async setVerifyEmail(userId: string): Promise<{ valid: boolean; message?: string }> {
        try {

            const key = btoa(userId);
            const url = process.env.CLI_URL + '/verify-email/' + key;


            const getKey = await storeRedis.get(key);
            if (!getKey) {
                await storeRedis.set(key, "Chờ duyệt email", { EX: 300 });
                const user = await SchemaUser.findById(userId);
                if (user) {
                    await templateEmailVerifyAccount(user?.email || "", url);
                }
                return { valid: true, message: "Thành công" };
            }
            return { valid: false, message: "Cookie đã đc gửi" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Redis error khi set token" };
        }
    }

    async hasVerifyEmail(key: string, userID: string): Promise<{ valid: boolean; message?: string }> {
        try {
            const getKey = await storeRedis.get(key);
            if (!getKey) return { valid: false, message: "Token không tồn tại hoặc đã hết hạn" };
            await storeRedis.del(key);
            await SchemaUser.updateOne({ _id: userID }, { verify: true });
            return { valid: true, message: "Thành công" };
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
    async updateUser(userId: string, data: any): Promise<{ valid: boolean; message?: string }> {
        try {
            const user = await SchemaUser.findOneAndUpdate({ _id: userId }, data, { new: true });
            if (!user) return { valid: false, message: "Không tìm thấy user" };
            return { valid: true, message: "Thành công" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async updateBio(userId: string, bio: string): Promise<{ valid: boolean; message?: string }> {
    try {
        const user = await SchemaUser.findOneAndUpdate({ _id: userId }, { bio }, { new: true });
        if (!user) return { valid: false, message: "Không tìm thấy user" };
        return { valid: true, message: "Thành công" };
    } catch (error: any) {
        return { valid: false, message: error.message || "Database error" };
    }
}
}

export default new UserModels();
