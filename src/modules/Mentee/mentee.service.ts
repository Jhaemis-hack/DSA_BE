import mongoose from "mongoose";
import Profiles from "../../models/profile";
import User from "../../models/user";
import { StatusCodes } from "http-status-codes";
import {
  create,
  getAll,
  getById,
  getByIdAndPopulate,
  getByQuery,
  getByQueryAndPopulate,
  getFew,
  getFewAndPopulate,
  updateById,
} from "../../../helper/mongooseQuery";
import {
  EXTENDED_ERROR_BAD_REQUEST,
  EXTENDED_ERROR_INTERNAL_SERVER,
  EXTENDED_ERROR_NOT_FOUND,
} from "../../utils/customErrors";
import {
  createAvailbilitykDto,
  FeedBackPayload,
  mongoIdType,
} from "../../../helper/validator";
import mentorShipRequest from "../../models/menteeRequest";
import Sessions from "../../models/session";
import mentorProfiles from "../../models/mentorProfile";
import AvailabilitySchema from "../../models/availability";

type MentorObject = {
  _id: string;
  name: string;
  skill: string;
  industry: string;
};

interface MentorshipRequestResponse {
  _id: string;
  mentorId: MentorObject;
  menteeId: string;
  status: string;
  createdAt: string;
}

export default class MenteeService {
  private readonly profileRepository = Profiles;
  private readonly userRepository = User;
  private readonly mentorShipRequestRepository = mentorShipRequest;
  private readonly sessionRepository = Sessions;
  private readonly mentorRepository = mentorProfiles;
  private readonly mentorAvailabilityRepository = AvailabilitySchema;

  async getRecommendedMentors(
    menteeId: string,
    filters: { skill?: string; industry?: string }
  ): Promise<{ status_code: number; message: string; data: any[] }> {
    const menteeProfile = await getByQuery(this.profileRepository, {
      menteeId,
    });

    if (!menteeProfile) {
      throw EXTENDED_ERROR_NOT_FOUND("Mentee profile not found.");
    }

    const { skill: menteeSkills } = menteeProfile;

    // Base query: skill intersection
    const baseQuery: any = {
      skill: { $in: menteeSkills },
    };

    // Optional filters
    if (filters.skill) {
      baseQuery.skill = { $in: [filters.skill] };
    }

    if (filters.industry) {
      baseQuery.industry = { $in: [filters.industry] };
    }

    const matchedMentors = await this.mentorRepository.find(baseQuery).lean();

    // const dataDto = matchedMentors.map( async mentor => {
    //   const sessionData = await getFew(this.sessionRepository, {mentorId:mentor._id});
    //   if (sessionData.length < 1) return;
    //   const totalRating = sessionData.reduce((totalCount, data) => {
    //     totalCount = totalCount + data.rating
    //   },0)

    //   return {
    //     averageRating: totalRating / sessionData.length,
    //     totalSessions: sessionData.length,
    //     name: mentor.name,
    //     skill: mentor.skill,
    //     industry: mentor.skill,
    //     id: mentor.mentorId,
    //   }
    // })

    return {
      status_code: 200,
      message: "Recommended mentors fetched successfully",
      data: matchedMentors,
    };
  }
  async fetchAllMentors(): Promise<{
    status_code: number;
    message: string;
    data: any[];
  }> {
    const mentors = await getAll(this.mentorRepository);

    if (mentors.length < 1) {
      throw EXTENDED_ERROR_NOT_FOUND(
        "There are no mentors on the program yet."
      );
    }

    return {
      status_code: StatusCodes.OK,
      message: "mentors fetched successfully",
      data: mentors,
    };
  }

  async getMenteeProfile(
    userId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    // Logic to get mentee profile by ID

    const profile = await getByQueryAndPopulate(
      this.profileRepository,
      { menteeId: userId },
      ["menteeId"]
    );
    if (!profile) {
      throw EXTENDED_ERROR_NOT_FOUND("Mentee profile not found");
    }

    const profileData = {
      _id: profile._id,
      email: profile.menteeId.email,
      username: profile.username,
      bio: profile.bio,
      skill: profile.skill,
      goals: profile.goals,
      role: profile.menteeId.role,
    };

    return {
      status_code: StatusCodes.OK,
      message: "Mentee profile retrieved successfully",
      data: profileData,
    };
  }

  async obtainUserProfile(
    userId: mongoIdType
  ): Promise<{ status_code: number; message: string; data: any }> {
    // Logic to get mentee profile by ID
    const profile = await getByQueryAndPopulate(
      this.profileRepository,
      { menteeId: userId },
      ["menteeId"]
    );

    if (!profile) {
      throw EXTENDED_ERROR_NOT_FOUND("Mentee profile not found");
    }

    const profileData = {
      _id: profile._id,
      email: profile.menteeId.email,
      username: profile.username,
      bio: profile.bio,
      skill: profile.skill,
      goals: profile.goals,
      role: profile.menteeId.role,
    };

    return {
      status_code: StatusCodes.OK,
      message: "Mentee profile retrieved successfully",
      data: profileData,
    };
  }

  async updateMenteeProfile(
    updateDto: any,
    menteeId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    // Logic to update mentee profile
    const profile = await getById(this.profileRepository, menteeId);

    if (!profile) {
      throw EXTENDED_ERROR_NOT_FOUND("Mentee profile not found");
    }

    const updatedProfile = await updateById(
      this.profileRepository,
      profile._id,
      updateDto
    );

    if (!updatedProfile) {
      throw EXTENDED_ERROR_INTERNAL_SERVER("Failed to update mentee profile");
    }

    return {
      status_code: StatusCodes.OK,
      message: "Mentee profile updated successfully.",
      data: updatedProfile,
    };
  }

  async requestMentorShip(
    mentorId: mongoIdType,
    menteeId: string,
    profId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    // Logic to delete mentee account
    const isUser = await getById(this.userRepository, menteeId);

    if (!isUser) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found.");
    }

    const isMentor = await getById(this.mentorRepository, mentorId);

    if (!isMentor) {
      throw EXTENDED_ERROR_NOT_FOUND("mentor does not exist.");
    }

    const isRequestExist = await getByQuery(this.mentorShipRequestRepository, {
      mentorId: mentorId,
      menteeId: profId,
    });

    if (
      (isRequestExist && isRequestExist?.status === "pending") ||
      isRequestExist?.status === "accepted"
    ) {
      throw EXTENDED_ERROR_BAD_REQUEST(
        "You have an active request to this mentor."
      );
    }

    const requestSent = await create(this.mentorShipRequestRepository, {
      mentorId: mentorId,
      menteeId: profId,
    });

    if (!requestSent) {
      throw EXTENDED_ERROR_INTERNAL_SERVER(
        "Failed to create mentorship request."
      );
    }

    return {
      status_code: StatusCodes.CREATED,
      message: "Mentorship request sent successfully",
      data: requestSent,
    };
  }

  async getSessions(
    menteeId: string,
    profId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    // Logic to delete mentee account
    const isUser = await getById(this.userRepository, menteeId);

    if (!isUser) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found.");
    }

    
    
    const existingSessions: any[] = await getFewAndPopulate(
      this.sessionRepository,
      { menteeId: profId },
      ["mentorId", "dateId"]
    );
    
    if (existingSessions.length < 1) {
      throw EXTENDED_ERROR_NOT_FOUND("No sessions exist for you yet.");
    }

    const dataDetails = existingSessions.map((session) => ({
      id: session._id,
      name: session.mentorId.name,
      skill: session.mentorId.skill,
      industry: session.mentorId.industry,
      sessionStatus: session.status,
      feedback: session.feedBack,
      rating: session.rating,
      date: session.dateId.date,
      start: session.dateId.startTime,
      end: session.dateId.endTime,
    }));

    return {
      status_code: StatusCodes.OK,
      message: "Sessions fetched successfully.",
      data: dataDetails,
    };
  }

  async sessionsFeedback(
    feedBackPayload: FeedBackPayload
  ): Promise<{ status_code: number; message: string; data: any }> {
    // Logic to delete mentee account
    const isUser = await getById(this.userRepository, feedBackPayload.menteeId);

    if (!isUser) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found.");
    }

    const session = await getByQuery(this.sessionRepository, {
      _id: feedBackPayload.sessionId,
      menteeId: feedBackPayload.profId,
    });

    if (!session) {
      throw EXTENDED_ERROR_NOT_FOUND(
        `Session with id: ${feedBackPayload.sessionId} not found !`
      );
    }

    const updatedSession = await updateById(
      this.sessionRepository,
      feedBackPayload.sessionId as string,
      {
        feedBack: feedBackPayload.feedback,
        rating: Number(feedBackPayload.rating),
      }
    );

    if (!updatedSession) {
      throw EXTENDED_ERROR_NOT_FOUND("Failed to save feedback");
    }

    return {
      status_code: StatusCodes.OK,
      message: "Feedback received.",
      data: updatedSession,
    };
  }

  async fetchMentorShipRequests(
    menteeId: string,
    profId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const isUser = await getById(this.userRepository, menteeId);

    if (!isUser) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found.");
    }

    const requests = await getFewAndPopulate(
      this.mentorShipRequestRepository,
      {
        menteeId: profId,
      },
      ["mentorId"]
    );

    if (requests.length < 1) {
      throw EXTENDED_ERROR_NOT_FOUND(`No Requests found !`);
    }

    const requestData = requests.map((request) => ({
      id: request.mentorId._id,
      name: request.mentorId.name,
      skill: request.mentorId.skill,
      industry: request.mentorId.industry,
      status: request.status,
      date: request.createdAt,
    }));

    return {
      status_code: StatusCodes.OK,
      message: "Requests fetched successfully.",
      data: requestData,
    };
  }

  async getAvailability(
    mentorId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const requests = await getByQuery(this.mentorAvailabilityRepository, {
      mentorId,
    });

    if (!requests) {
      throw EXTENDED_ERROR_NOT_FOUND(`Mentor has not set availability yet!`);
    }

    return {
      status_code: StatusCodes.OK,
      message: "Requests fetched successfully.",
      data: {
        id: requests._id,
        date: requests.date,
        start: requests.startTime,
        end: requests.endTime,
      },
    };
  }

  async bookSession(
    mentorId: string,
    profId: string,
    date: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const isSession = await getByQuery(this.sessionRepository, {
      mentorId,
      menteeId: profId,
      status: "scheduled",
    });

    if (isSession) {
      throw EXTENDED_ERROR_BAD_REQUEST(
        "You already have an active session with this mentor."
      );
    }

    const dateId = (
      await getByQuery(this.mentorAvailabilityRepository, { mentorId })
    )?._id;

    if (!dateId) {
      throw EXTENDED_ERROR_BAD_REQUEST(
        "availability has not been set by mentor yet."
      );
    }

    const newSession = await create(this.sessionRepository, {
      mentorId: mentorId,
      menteeId: profId,
      dateId,
      date,
    });

    if (newSession < 1) {
      throw EXTENDED_ERROR_NOT_FOUND("No session available yet.");
    }

    return {
      status_code: StatusCodes.OK,
      message: `Sessions created successfully`,
      data: newSession,
    };
  }
}
