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
            return { valid: true, user };
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async findUserById(id: string): Promise<{ valid: boolean; user?: any; message?: string }> {
        try {
            const user = await SchemaUser.findById(id);
            return user ? { valid: true, user } : { valid: false, message: "User not found" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async updateAvatar(userId: string, avatar: string):
        Promise<{ valid: boolean; user?: any; message?: string }> {
        try {
            const user = await SchemaUser.findOneAndUpdate({ _id: userId }, { avatar }, { new: true });
            return user ? { valid: true, user } : { valid: false, message: "User not found" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Database error" };
        }
    }
    async setVerifyEmail(userId: string): Promise<{ valid: boolean; message?: string }> {
        try {
            const url = process.env.CLI_URL + '/verify-email/' + userId;
            if (storeRedis.isReady) {
                await storeRedis.set(userId, url, { EX: 300 });
                const a = await storeRedis.get(userId);
                console.log(a);

                const user = await SchemaUser.findById(userId);
                if (user) {
                    await templateEmailVerifyAccount(user?.email || "", url);
                }
                return { valid: true, message: "Thành công" };
            }
            return { valid: false, message: "Redis not ready" };
        } catch (error: any) {
            return { valid: false, message: error.message || "Redis error khi set token" };
        }
    }
    async getVerifyEmail(userId: string): Promise<{ valid: boolean; url?: string; message?: string }> {
        try {

            const url = await storeRedis.get(userId);
            if (url) {
                return { valid: true, message: "token da ton tai" };
            }
            return { valid: false, message: "token khong ton tai", };
        } catch (error: any) {
            return { valid: false, message: error.message || "Redis error khi get token" };
        }
    }
    async hasVerifyEmail(userId: string): Promise<{ valid: boolean; message?: string }> {
        try {
            const url = await storeRedis.get(userId);
            if (url) {
                await storeRedis.del(userId);
                const a = await SchemaUser.updateOne({ _id: userId }, { verify: true });
                return { valid: true, message: "Thành công" };
            } else {
                return { valid: false, message: "Token không tồn tại hoặc đã hết hạn" };
            }
        } catch (error: any) {
            return { valid: false, message: error.message || "Redis error khi get token" };
        }
    }
}

export default UserModels;
