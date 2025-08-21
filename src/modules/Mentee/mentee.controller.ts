import { Request, Response } from "express";
import MenteeService from "./mentee.service";
import {
  createAvailbilitykDto,
  createSessionDto,
  FeedBackDto,
  FeedBackPayload,
  menteeProfileUpdateDto,
  mongoIdType,
  ResponseType,
} from "../../../helper/validator";
import { CONTROLLER_ERROR } from "../../utils/customErrors";
import mongoose from "mongoose";

const menteeService = new MenteeService();


export const getRecommendedMentors = async (req: Request, res: Response) => {
  try {
    const menteeId: string = req.auth.id;

    const { skill, industry } = req.query;

    const response = await menteeService.getRecommendedMentors(menteeId, {
      skill: skill as string,
      industry: industry as string,
    });

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("getRecommendedMentors Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const fetchMentors = async (req: Request, res: Response) => {
  try {
    const { skill, industry } = req.query;

    const response = await menteeService.fetchAllMentors();

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("fetchAllMentors Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};


export const userProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.id;

    const response: ResponseType = await menteeService.getMenteeProfile(userId);

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("userProfile Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const userId: mongoIdType = new mongoose.Types.ObjectId(id);

    const response: ResponseType = await menteeService.obtainUserProfile(
      userId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("getUserProfile Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const menteeProfileUpdate = async (req: Request, res: Response) => {
  try {
    const updateDto: menteeProfileUpdateDto = req.body;

    menteeProfileUpdateDto.parse(updateDto); // Validate the request body

    const menteeId = req.auth.profileId;

    const response: ResponseType = await menteeService.updateMenteeProfile(
      updateDto,
      menteeId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("menteeProfileUpdate Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const menteeMentorRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const mentorId: mongoIdType = new mongoose.Types.ObjectId(id);

    const menteeId = req.auth.id;

    const profId = req.auth.profileId;

    const response: ResponseType = await menteeService.requestMentorShip(
      mentorId,
      menteeId,
      profId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("menteeMentorRequest Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const menteeSessions = async (req: Request, res: Response) => {
  try {

    const menteeId = req.auth.id;
    const profId = req.auth.profileId;

    const response: ResponseType = await menteeService.getSessions(
      menteeId,
      profId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("menteeSessions Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const menteeSessionFeedback = async (req: Request, res: Response) => {
  try {
    const id = req.params.sesid;
    const sessionId: mongoIdType = new mongoose.Types.ObjectId(id);

    const FeedBackData: FeedBackDto = req.body;

    FeedBackDto.parse(FeedBackData)

    const feedBackPayload: FeedBackPayload = {
      sessionId,
      menteeId: req.auth.id,
      profId: req.auth.profileId,
      feedback: FeedBackData.feedback,
      rating: FeedBackData.rating,
    };

    const response: ResponseType = await menteeService.sessionsFeedback(
      feedBackPayload
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("menteeSessionFeedback Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const getMenteeMontorshipRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const menteeId = req.auth.id;
    const profId = req.auth.profileId;    

    const response: ResponseType = await menteeService.fetchMentorShipRequests(
      menteeId,
      profId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("getMenteeMontorshipRequest Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const getMentorAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const mentorId: string = req.params.mentorId;

    const response: ResponseType = await menteeService.getAvailability(
      mentorId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("getMenteeMontorshipRequest Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const bookMentorSession = async (
  req: Request,
  res: Response
) => {
  try {
    const mentorId: string = req.params.mentorId;

    const profId: string = req.auth.profileId;

    const sessionDto: createSessionDto = req.body;

    createSessionDto.parse(sessionDto)

    const response: ResponseType = await menteeService.bookSession(
      mentorId,
      profId,
      sessionDto.date
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("getMenteeMontorshipRequest Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};
