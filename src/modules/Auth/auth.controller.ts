import { Request, Response } from "express";
import AuthService from "./auth.services";
import { profileUpdateDto, ResponseType, userLoginDto, userSignUpDto } from "../../../helper/validator";
import { CONTROLLER_ERROR } from "../../utils/customErrors";
import { StatusCodes } from "http-status-codes";

const authService = new AuthService();



export const userLogin = async (req: Request, res: Response) => {
  try {
    const LoginDto: userLoginDto = req.body;

    userLoginDto.parse(LoginDto); // Validate the request body

    const response: ResponseType = await authService.Login(LoginDto);

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("userLogin Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
} ;

export const userSignUp = async (req: Request, res: Response) => {
  try {
    const SignUpDto: userSignUpDto = req.body;

    userSignUpDto.parse(SignUpDto); // Validate the request body

    const response: ResponseType = await authService.SignUp(SignUpDto);

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("userSignUp Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const profileUpdate = async (req: Request, res: Response) => {
  try {
    const ProfileDto: profileUpdateDto = req.body;

    profileUpdateDto.parse(ProfileDto); // Validate the request body

    const userId = req.auth.id;
    const profId = req.auth.profileId;

    const response: ResponseType = await authService.UpdateProfile(ProfileDto, userId, profId);

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("profileUpdate Error:",  error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {

    const userId = req.auth.id;

    req.auth = null; // Clear the auth object

    res.status(StatusCodes.OK).json({
      status_code: StatusCodes.OK,
      message: "Logout successful",
      data: null,
    });
  } catch (error: any) {
    console.error("logOut Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.id;    

    const response: ResponseType = await authService.obtainUser(userId);

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("getUser Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};
