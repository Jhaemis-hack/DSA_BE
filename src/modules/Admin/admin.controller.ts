import { Request, Response } from "express";
import {
  adminAssignRoleDto,
  menteeProfileUpdateDto,
  mongoIdType,
  ResponseType,
  userSignUpDto,
} from "../../../helper/validator";
import { CONTROLLER_ERROR, EXTENDED_ERROR_BAD_REQUEST } from "../../utils/customErrors";
import AdminService from "./admin.service";
import mongoose from "mongoose";
import AuthService from "../Auth/auth.services";

const adminService = new AdminService();
const authService = new AuthService();

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const response: ResponseType = await adminService.fetchUsers();

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("admin User fetching Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const upgradeRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const userId: mongoIdType = new mongoose.Types.ObjectId(id);

    const assignedRoleRaw = req.query.nwrole;

    const response: ResponseType = await adminService.updateUserRole(
      userId,
      assignedRoleRaw as string
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("admin User fetching Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const addNewUser = async (req: Request, res: Response) => {
  try {
    const SignUpDto: userSignUpDto = req.body;

    userSignUpDto.parse(SignUpDto); // Validate the request body

    const response: ResponseType = await authService.SignUp(SignUpDto);

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("admin create user Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const editedData: menteeProfileUpdateDto = req.body;

    menteeProfileUpdateDto.parse(editedData);

    const userId: mongoIdType = new mongoose.Types.ObjectId(id);

    const response: ResponseType = await adminService.editUserDetails(
      userId, editedData
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("admin create user Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};
