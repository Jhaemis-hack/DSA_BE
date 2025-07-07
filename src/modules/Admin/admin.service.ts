import { StatusCodes } from "http-status-codes";
import {
  getAll,
  getAllAndPopulate,
  getByEmail,
  getById,
  getByQuery,
  updateById,
} from "../../../helper/mongooseQuery";
import mentorProfiles from "../../models/mentorProfile";
import Profiles from "../../models/profile";
import User from "../../models/user";
import {
  EXTENDED_ERROR_BAD_REQUEST,
  EXTENDED_ERROR_INTERNAL_SERVER,
  EXTENDED_ERROR_NOT_FOUND,
} from "../../utils/customErrors";
import { adminAssignRoleDto, menteeProfileUpdateDto } from "../../../helper/validator";
import MenteeService from "../Mentee/mentee.service";

const menteeService = new MenteeService()

interface user {
  menteeId: any;
  email: string;
  username: string;
  role: string;
  bio: string;
  skill: string[];
  goals: string;
}

type Userlist = user[];

export default class AdminService {
  private readonly userRepository = User;
  private readonly profileRepository = Profiles;
  private readonly mentorRepository = mentorProfiles;
  private readonly secret = process.env.JWT_SECRET || "defaultsecret";

  async fetchUsers(): Promise<{
    status_code: number;
    message: string;
    data: any;
  }> {
    const menteeList: Userlist = await getAllAndPopulate(
      this.profileRepository,
      ["menteeId"]
    );

    if (menteeList.length < 1) {
      throw EXTENDED_ERROR_NOT_FOUND("Could not find any mentees.");
    }

    const mentorList = await getAllAndPopulate(this.mentorRepository, [
      "mentorId",
    ]);

    if (mentorList.length < 1) {
      throw EXTENDED_ERROR_NOT_FOUND("Could not find any mentors.");
    }

    const menteeCategory = await menteeList.map((user) => ({
      name: user.username,
      email: user.menteeId.email,
      bio: user.bio,
      skill: user.skill,
      goals: user.goals,
      role: user.menteeId.role,
    }));

    const mentorCategory = await mentorList.map((mentor) => ({
      name: mentor.name,
      email: mentor.mentorId.email,
      bio: mentor.bio,
      skill: mentor.skill,
      industry: mentor.industry,
      role: mentor.mentorId.role,
    }));

    const dataObj = {
      Mentee_List: menteeCategory,
      Mentor_List: mentorCategory,
    };

    return {
      status_code: StatusCodes.OK,
      message: "Users data fetched successfully.",
      data: dataObj,
    };
  }

  async updateUserRole(userId: any, newRole: adminAssignRoleDto): Promise<{
    status_code: number;
    message: string;
    data: any;
  }> {

    const isUser =await getById(this.userRepository, userId);

    const role:string = newRole.role;

    if (!isUser){
        throw EXTENDED_ERROR_NOT_FOUND("user not found!")
    }

    isUser.role = role;

    const upgradeUser = await updateById(this.userRepository, userId, isUser);

    if (!upgradeUser){
        throw EXTENDED_ERROR_INTERNAL_SERVER(`Failed to upgrade user with email: ${isUser.email}`)
    }

    return {
      status_code: StatusCodes.OK,
      message: "Users data fetched successfully.",
      data: {
        _id: upgradeUser._id,
        email: upgradeUser.email,
        role: upgradeUser.role
      },
    };
  };

  async editUserDetails(userId: any, editedData: menteeProfileUpdateDto): Promise<{
    status_code: number;
    message: string;
    data: any;
  }> {

    const isupdated = await menteeService.updateMenteeProfile(editedData, userId);

    return {
      status_code: StatusCodes.OK,
      message: "Users profile updated successfully.",
      data: isupdated,
    };
  };
}
