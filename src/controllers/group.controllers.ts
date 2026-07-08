import type { Request, Response } from "express";
import GroupService from "../models/group/group.models.ts";
import TaskService from "../models/task/task.models.ts";
import { getIO } from "../third-party/socket/socket.ts";
import {
  destroyImage,
  uploadImage,
} from "../third-party/upload-images/multer.ts";
import type { MulterFile } from "../unit/type_project/multerfile.type.ts";
import type { ICreateGroupDTO } from "../unit/type_project/group/icreate_group_dto.type.ts";
import type { IGroup } from "../unit/type_project/group/schema.type.ts";
import type { ICreateGroupResponse } from "../unit/type_project/group/response_create_group.type.ts";
import { sendGroupInvitationEmail } from "../third-party/emailjs/send_verify_join_group.ts";

class GroupController {
  private groupService = GroupService;
  private taskService = TaskService;
  getRoleMember = async (req: Request, res: Response): Promise<void> => {
    const { id_group } = req.params;
    const userId = req.userID;
    const result = await this.groupService.getRoleGroup(
      id_group,
      userId as string,
    );
    res.status(result.valid ? 200 : 400).json(result);
  };
  public createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name_project, deadline } = req.body;
      const userCreater = req.userID as string;
      const files = req.files as MulterFile[];
      const uploadResult = await uploadImage(files);
      if ((uploadResult as { valid?: boolean }).valid === false) {
        res.status(400).json(uploadResult);
        return;
      }
      const groupData: ICreateGroupDTO = {
        projectName: name_project,
        creator: userCreater,
        deadline: new Date(deadline),
        image: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        },
      };
      const result = (await this.groupService.create(
        groupData,
      )) as ICreateGroupResponse;
      if (result.valid) {
        const newObject = result.group as unknown as IGroup;
        getIO().emit("new-group", {
          ...newObject,
          image: `${newObject.image.url}`,
        });
        res.status(201).json(result);
        return;
      }
      res.status(400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI TẠO GROUP:", error);
      if (error.name === "ValidationError" || error.code === 11000) {
        res.status(400).json({
          valid: false,
          message: "Dữ liệu không hợp lệ hoặc đã tồn tại.",
        });
        return;
      }
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public getMyGroups = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userID as string;
      const { limit, page } = req.query;
      const result = await this.groupService.findGroupsByUserId(
        userId,
        parseInt(limit as string),
        parseInt(page as string),
      );
      result.groups = result.groups.map((group: IGroup) => {
        return {
          ...group.toObject(),
          image: `${group.image.url}`,
        };
      }) as any;
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public addMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id_group } = req.params;
      const { userID } = req.body;
      const result = await this.groupService.addMember(id_group, userID);
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public getMemberIngroup = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id_group } = req.params;
      const result = await this.groupService.getFullMemberIngroup(id_group);
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  inviteJoinGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userID, id_group, email, groupName, username } = req.body;

      const result = await this.groupService.inviteJoinGroup(id_group, userID);
      if (!result.valid) {
        res.status(400).json(result);
        return;
      }
      const redisKey = `${id_group}:${userID}`;
      const urlCheck = `${process.env.CLI_URL}/join-group?id_verify=${redisKey}`;
      sendGroupInvitationEmail(
        email,
        username,
        result.name_group as string,
        urlCheck,
      );
      res.status(201).json({
        valid: true,
        message: "Đã gửi lời mời tham gia nhóm thành công.",
        link: urlCheck,
      });
    } catch (error: any) {
      console.error("LỖI KHI MỜI NGƯỜI DÙNG:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  verifyJoinGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id_verify } = req.body;
      const [id_group, userID] = id_verify.split(":");
      const result = await this.groupService.ActiveJoinGroup(id_group, userID);
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI XÁC MINH THAM GIA NHÓM:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public getListMemberIngroupHasJoined = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id_group } = req.params;
      const result =
        await this.groupService.getListMemberIngroupHasJoined(id_group);
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public getListMemberIngroupHasNotJoined = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id_group } = req.params;
      const result =
        await this.groupService.getListMemberIngroupHasNotJoined(id_group);
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public changeRoleLeader = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const idLeader = req.userID;
      const { userID, id_group } = req.body;
      const result = await this.groupService.changeRoleLeader(
        id_group,
        idLeader as string,
        userID,
      );
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public changeRoleMember = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const idLeader = req.userID;
      const { userID, id_group } = req.body;
      const result = await this.groupService.changeRoleMember(
        id_group,
        idLeader as string,
        userID,
      );
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public changeRoleConfirmer = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const idLeader = req.userID;
      const { userID, id_group } = req.body;
      const result = await this.groupService.changeRoleConfirmer(
        id_group,
        idLeader as string,
        userID,
      );
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public kickMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const idLeader = req.userID;
      const { id_group, userID } = req.body;
      const result = await this.groupService.kickMember(
        id_group,
        idLeader as string,
        userID,
      );
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public getInfoGroup = async (req: Request, res: Response) => {
    try {
      const userID = req.userID;
      const { id_group } = req.params;
      const checkMember = await this.groupService.getRoleGroup(
        id_group,
        `${userID}`,
      );
      if (!checkMember.valid) {
        res.status(401).json({
          valid: false,
          message: "Yêu cầu xác thực và cung cấp vai trò.",
        });
        return;
      }
      const result = await this.taskService.getInfoTask(id_group);

      res.status(result.valid ? 201 : 400).json(result);
    } catch (error) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public topFiveMemberCompletedTaskMore = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id_group } = req.params;
      const result = await this.groupService.topFiveMemberCompletedTaskMore(
        `${id_group}`,
      );
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI LẤY GROUP:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public leaveGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const userID = req.userID;
      const { id_group } = req.body;
      const result = await this.groupService.leaveGroup(id_group, `${userID}`);
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI RỜI NHÓM:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public deleteGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const userID = req.userID;
      const { id_group } = req.params;
      const result = await this.groupService.deleteGroup(id_group, `${userID}`);
      destroyImage(result.img_public_id as string);
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI XOA NHÓM:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
  public updateGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const userID = req.userID;
      const { id_group, name_project, deadline } = req.body;
      const files = req.files as MulterFile[] | undefined;
      if (files && files.length > 0) {
        const uploadResult = await uploadImage(files);
        if ((uploadResult as { valid?: boolean }).valid === false) {
          res.status(400).json(uploadResult);
          return;
        }
        req.body.image = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };
      }
      const db = {
        projectName: name_project,
        deadline,
        image: req.body.image,
      };
      const result = await this.groupService.updateGroup(
        id_group,
        `${userID}`,
        db,
      );
      res.status(result.valid ? 201 : 400).json(result);
    } catch (error: any) {
      console.error("LỖI KHI CÁNH BÁO NHÓM:", error);
      res.status(500).json({ valid: false, message: "Lỗi server nội bộ." });
    }
  };
}

export default new GroupController();
