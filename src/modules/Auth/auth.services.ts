require("dotenv").config();
import mongoose, { mongo } from "mongoose";
import {
  create,
  getByEmail,
  getById,
  getByQuery,
  updateById,
} from "../../../helper/mongooseQuery";
import {
  profileUpdateDto,
  userLoginDto,
  userSignUpDto,
} from "../../../helper/validator";
import User from "../../models/user";
import {
  EXTENDED_ERROR_BAD_REQUEST,
  EXTENDED_ERROR_INTERNAL_SERVER,
  EXTENDED_ERROR_NOT_FOUND,
} from "../../utils/customErrors";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Profiles from "../../models/profile";
import { string } from "zod/v4";
import mentorProfiles from "../../models/mentorProfile";

interface userType {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: string;
}

export default class AuthService {
  private readonly userRepository = User;
  private readonly profileRepository = Profiles;
  private readonly mentorRepository = mentorProfiles;
  private readonly secret = process.env.JWT_SECRET || "defaultsecret";

  async Login(
    LoginDto: userLoginDto
  ): Promise<{ status_code: number; message: string; data: any }> {
    const user: userType = await getByEmail(
      this.userRepository,
      LoginDto.email
    );
    if (!user) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found");
    }

    const isUser = await bcrypt.compare(LoginDto.password, user.password);

    if (!isUser) {
      throw EXTENDED_ERROR_BAD_REQUEST("Invalid credentials");
    }

    let profileId: string | null;

    if (user.role === "mentee") {
      profileId = (
        await getByQuery(this.profileRepository, { menteeId: user._id })
      )._id;
    } else if (user.role === "mentor") {
      profileId = (
        await getByQuery(this.mentorRepository, { mentorId: user._id })
      )._id;
    } else {
      profileId = null;
    }

    const token = jwt.sign(
      { id: user._id, profileId, email: user.email, role: user.role },
      this.secret,
      {
        expiresIn: "1h",
      }
    );

    // Add password verification logic here
    return {
      status_code: StatusCodes.OK,
      message: "Login successful",
      data: {
        email: user.email,
        token: token,
      },
    };
  }

  async SignUp(
    SignUpDto: userSignUpDto
  ): Promise<{ status_code: number; message: string; data: any }> {
    const user: userType = await getByEmail(
      this.userRepository,
      SignUpDto.email
    );
    if (user) {
      throw EXTENDED_ERROR_BAD_REQUEST(
        "User already exist. Please login instead."
      );
    }

    const hashedPassword = await bcrypt.hash(SignUpDto.password, 10);

    const createdUser = await create(this.userRepository, {
      email: SignUpDto.email,
      password: hashedPassword,
    });

    if (!createdUser) {
      throw EXTENDED_ERROR_INTERNAL_SERVER("Failed to create user");
    }

    let profileId:string | null;

    if (createdUser.role === "mentee") {
      profileId = (await create(this.profileRepository, { menteeId: createdUser._id }))._id;
    } else if (createdUser.role === "mentor"){
      profileId = (await create(this.mentorRepository, { menteeId: createdUser._id }))._id;
    } else {
      profileId = null;
    }

    const token = jwt.sign(
      { id: createdUser._id, profileId, email: createdUser.email, role: createdUser.role },
      this.secret,
      {
        expiresIn: "1h",
      }
    );

    // Add password verification logic here
    return {
      status_code: StatusCodes.CREATED,
      message: "SignUp successful",
      data: {
        email: createdUser.email,
        token: token,
      },
    };
  }

  async UpdateProfile(
    ProfileDto: profileUpdateDto,
    userId: string,
    profId: string,
  ): Promise<{ status_code: number; message: string; data: any }> {
    const user = await getByQuery(this.profileRepository, { userId: userId });

    if (user) {
      throw EXTENDED_ERROR_BAD_REQUEST(
        "User profile already exists. Please update instead."
      );
    }

    const updateProfile = await updateById(this.profileRepository, profId, ProfileDto);

    if (!updateProfile) {
      throw EXTENDED_ERROR_INTERNAL_SERVER("Failed to update profile");
    }

    // Add password verification logic here
    return {
      status_code: StatusCodes.CREATED,
      message: "profile created successfully.",
      data: updateProfile,
    };
  }

  async obtainUser(
    userId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const user = await getById(this.userRepository, userId);

    if (!user) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found");
    }

    // Add password verification logic here
    return {
      status_code: StatusCodes.OK,
      message: "user fetched successfully.",
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
