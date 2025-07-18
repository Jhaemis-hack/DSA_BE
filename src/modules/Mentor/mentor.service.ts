import { StatusCodes } from "http-status-codes";
import Profiles from "../../models/profile";
import User from "../../models/user";
import mentorShipRequest from "../../models/menteeRequest";
import Sessions from "../../models/session";
import {
  create,
  getById,
  getByQuery,
  getByQueryAndPopulate,
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
  editAvailbilitykDto,
  mongoIdType,
} from "../../../helper/validator";
import AvailabilitySchema from "../../models/availability";
import mentorProfiles from "../../models/mentorProfile";

export default class MentorService {
  private readonly profileRepository = Profiles;
  private readonly mentorProfileRespository = mentorProfiles;
  private readonly userRepository = User;
  private readonly mentorShipRequestRepository = mentorShipRequest;
  private readonly sessionRepository = Sessions;
  private readonly availabilityRepository = AvailabilitySchema;

  async fetchMenteeRequests(
    userId: string,
    profId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const isUser = await getById(this.userRepository, userId);

    if (!isUser) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found.");
    }

    const menteeRequests = await getFewAndPopulate(
      this.mentorShipRequestRepository,
      {
        mentorId: profId,
      },
      ["menteeId"]
    );

    if (menteeRequests.length < 1) {
      throw EXTENDED_ERROR_NOT_FOUND("No mentorship request found.");
    }

    const dataDetails = menteeRequests.map((request) => {
      if (request.status === "accepted" || request.status === "rejected") {
        return;
      }
      return {
        _id: request._id,
        menteeId: request.menteeId._id,
        name: request.menteeId.username,
        bio: request.menteeId.bio,
        skill: request.menteeId.skill,
        goals: request.menteeId.goals,
        status: request.status,
      };
    });

    return {
      status_code: StatusCodes.OK,
      message: "mentorship Requests fetched successfully",
      data: dataDetails,
    };
  }

  async requestStatusAction(
    userId: string,
    requestId: mongoIdType,
    action: string,
    profId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const isUser = await getById(this.userRepository, userId);

    if (!isUser) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found.");
    }

    const menteeRequest = await getById(
      this.mentorShipRequestRepository,
      requestId
    );

    if (!menteeRequest) {
      throw EXTENDED_ERROR_NOT_FOUND("No mentorship request found.");
    }

    if (
      menteeRequest.status === "accepted" ||
      menteeRequest.status === "rejected"
    ) {
      throw EXTENDED_ERROR_BAD_REQUEST("Request is no more active !");
    }

    if (!action) {
      throw EXTENDED_ERROR_BAD_REQUEST("No action specified.");
    }

    menteeRequest.status = action;

    const updatedRequest = await menteeRequest.save();

    return {
      status_code: StatusCodes.OK,
      message: `Request ${action} successfully`,
      data: null,
    };
  }

  async fetchSessions(
    userId: string,
    profId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const isUser = await getById(this.userRepository, userId);

    if (!isUser) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found.");
    }

    const Sessions = await getFewAndPopulate(
      this.sessionRepository,
      {
        mentorId: profId,
      },
      ["dateId", "mentorId", "menteeId"]
    );

    if (Sessions.length < 1) {
      throw EXTENDED_ERROR_NOT_FOUND("No session available yet.");
    }

    const dataDetails = Sessions.map((session) => ({
      id: session._id,
      name: session.menteeId.username,
      skill: session.menteeId.skill,
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
      message: `Sessions fetched successfully`,
      data: dataDetails,
    };
  }

  async sessionCreate(
    userId: string,
    profId: string,
    requestId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const isUser = await getById(this.userRepository, userId);

    if (!isUser) {
      throw EXTENDED_ERROR_NOT_FOUND("User not found.");
    }

    const requestData = await getById(
      this.mentorShipRequestRepository,
      requestId
    );

    if (!requestData) {
      throw EXTENDED_ERROR_BAD_REQUEST("Error loading request body.");
    }

    const dateId = (
      await getByQuery(this.availabilityRepository, { mentorId: profId })
    )?._id;

    if (!dateId) {
      throw EXTENDED_ERROR_BAD_REQUEST(
        "availability has not been set by user yet."
      );
    }

    const newSession = await create(this.sessionRepository, {
      mentorId: requestData.mentorId,
      menteeId: requestData.menteeId,
      dateId,
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

  async editAvailbility(
    editData: editAvailbilitykDto,
    profId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    const availablePeriod = await getByQuery(this.availabilityRepository, {
      mentorId: profId,
    });

    if (!availablePeriod) {
      createAvailbilitykDto.parse(editData);

      const newEditData = {
        mentorId: profId,
        ...editData,
      };

      const newAvailablePeriod = Object.assign({}, newEditData);

      const createdAvailability = await create(
        this.availabilityRepository,
        newAvailablePeriod
      );

      if (!createdAvailability) {
        throw EXTENDED_ERROR_INTERNAL_SERVER("could not set available period.");
      }

      return {
        status_code: StatusCodes.OK,
        message: "Mentor availability updated successfully.",
        data: {
          date: createdAvailability.date,
          start: createdAvailability.startTime,
          end: createdAvailability.endTime,
        },
      };
    }

    const updatedAvailablePeriod = Object.assign(availablePeriod, editData);

    updatedAvailablePeriod.save();

    return {
      status_code: StatusCodes.OK,
      message: "Mentor availability updated successfully.",
      data: {
        date: updatedAvailablePeriod.date,
        start: updatedAvailablePeriod.startTime,
        end: updatedAvailablePeriod.endTime,
      },
    };
  }

  async getMentorProfile(
    mentorId: string
  ): Promise<{ status_code: number; message: string; data: any }> {
    // Logic to get mentee profile by ID

    const profile = await getByQueryAndPopulate(
      this.mentorProfileRespository,
      { mentorId: mentorId },
      ["mentorId"]
    );
    if (!profile) {
      throw EXTENDED_ERROR_NOT_FOUND("Mentee profile not found");
    }

    const profileData = {
      _id: profile._id,
      email: profile.mentorId.email,
      username: profile.name,
      skill: profile.skill,
      industry: profile.industry,
      role: profile.mentorId.role,
    };

    return {
      status_code: StatusCodes.OK,
      message: "Mentor profile retrieved successfully",
      data: profileData,
    };
  }
}
