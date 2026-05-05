import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModels from "../models/user/user.models";
import GroupService from "../models/group/group.models";
import { destroyImage, uploadImage } from "../third-party/upload-images/multer";
import type { MulterFile } from "../unit/type_project/multerfile.type";
import { storeRedis } from "../third-party/redis/redis";
class UserControllers {
    private _userModel = userModels;
    private _groupService = GroupService;
    private _hashToken: (id: string) => string
    constructor() {
        this._hashToken = (id: string) => {
            return jwt.sign(
                { id }, // payload nên là object
                process.env.SECRET_KEY as string,
                { expiresIn: "7d" }
            );
        };
    }
    create = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { email, password, username } = req.body;
            const created = await this._userModel.create(email, password, username);
            return created.valid
                ? res.status(201).json({ valid: true, user: created.user })
                : res.status(400).json({ valid: false, message: created.message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                valid: false,
                message: (error as Error).message
            });
        }
    }
    public getUserByEmail = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { email } = req.query;
            const user = await this._userModel.findUserByEmail(`${email}`);
            return user.valid
                ? res.status(200).json({ valid: true, user: user.user })
                : res.status(400).json({ valid: false, message: user.message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                valid: false,
                message: (error as Error).message
            });
        }
    }

    login = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const logged = await this._userModel.login(email, password);

            return logged.valid
                ? res.status(200).cookie("token", this._hashToken(logged.user._id), {
                    httpOnly: process.env.ENVIRONMENT === "dev" ? false : true,
                    secure: process.env.ENVIRONMENT === "dev" ? false : true,
                    sameSite: process.env.ENVIRONMENT === "dev" ? "lax" : "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                }).json({ valid: true, cookies: this._hashToken(logged.user._id), message: "Thành Công" })
                : res.status(400).json({ valid: false, message: logged.message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                valid: false,
                message: (error as Error).message
            });
        }
    }
    autoLogin = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.userID as string;
            const getUser = await storeRedis.get(id)
            if (getUser) {
                res.status(200).json(JSON.parse(getUser));
            } else {
                const user = await this._userModel.findUserById(id as string);
                storeRedis.set(id, JSON.stringify(user), {
                    EX: 10 * 60
                })
                res.status(200).json(user);
            }

        } catch (error) {
            res.status(500).json({ valid: false, message: (error as Error).message });
        }
    }
    sendVerifyEmail = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.userID;
            const sent = await this._userModel.setVerifyEmail(id as string);
            return sent.valid
                ? res.status(200).json(sent)
                : res.status(400).json(sent);
        } catch (error) {
            res.status(500).json({ valid: false, message: (error as Error).message });
        }
    }
    checkVerifyEmail = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.userID as string;
            const { key } = req.body;

            const checkVerifyEmail = await this._userModel.hasVerifyEmail(id as string);
            const user = await this._userModel.findUserById(id as string);

            storeRedis.set(id, JSON.stringify(user), {
                EX: 10 * 60
            })
            return checkVerifyEmail.valid
                ? res.status(200).json({ valid: true, message: "Thành Công" })
                : res.status(400).json({ valid: false, message: checkVerifyEmail.message });
        } catch (error) {
            res.status(500).json({ valid: false, message: (error as Error).message });
        }
    }
    findUserByEmail = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { email, id_group } = req.query;
            const user = await this._userModel.findUserByEmail(`${email}`);
            const findMemberInGroup = await this._groupService.getUserRoleInGroup(id_group as string, user.user._id);

            if (findMemberInGroup) {
                res.status(201).json({ valid: true, user: user.user, userInGroup: true })
                return;
            }
            res.status(user.valid ? 201 : 400).json({ valid: true, user: user.user, userInGroup: false });

        } catch (error) {
            res.status(500).json({ valid: false, message: (error as Error).message });
        }
    }

    public updateUser = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { email, username, password } = req.body;
            const id = req.userID;
            if (req.files?.length) {
                const uploadResult = await uploadImage(req.files as MulterFile[]);
                const avatar = {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url
                };
                const user = { email, username, password, avatar };

                const updateUser = await this._userModel.updateUser(id as string, user);
                if (updateUser.avatar_public_id?.trim().length) {
                    destroyImage(updateUser.avatar_public_id as string);
                }
                res.status(updateUser.valid ? 200 : 400).json(updateUser);
            } else {
                const user = { email, username, password };
                const updateUser = await this._userModel.updateUser(id as string, user);
                res.status(updateUser.valid ? 200 : 400).json(updateUser);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: (error as Error).message });
        }
    }
    public updateBio = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { bio } = req.body;
            const id = req.userID;
            const updateBio = await this._userModel.updateBio(id as string, bio);
            res.status(updateBio.valid ? 200 : 400).json(updateBio);
        } catch (error) {
            console.log(error);
            res.status(500).json({ valid: false, message: (error as Error).message });
        }
    }
}
export default new UserControllers();