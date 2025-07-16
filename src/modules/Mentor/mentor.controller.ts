import { Request, Response } from "express";
import { editAvailbilitykDto, mongoIdType, ResponseType } from "../../../helper/validator";
import MentorService from "./mentor.service";
import { CONTROLLER_ERROR } from "../../utils/customErrors";
import mongoose from "mongoose";

const menteeService = new MentorService();

export const viewMentorShipRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.id;
    const profId = req.auth.profileId;

    const response: ResponseType = await menteeService.fetchMenteeRequests(
      userId,
      profId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("viewMentorShipRequests Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const updateStatusRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.id;

    const profId = req.auth.profileId;

    const statusAction: any = req.query.atn;

    const id = req.params.reqid;

    const requestId: mongoIdType = new mongoose.Types.ObjectId(id);

    const response: ResponseType = await menteeService.requestStatusAction(
      userId,
      requestId,
      statusAction,
      profId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("userProfile Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const getMenteeSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.id;

    const profId = req.auth.profileId;

    const response: ResponseType = await menteeService.fetchSessions(
      userId,
      profId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("userProfile Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const createSession = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.id;
    const profId = req.auth.profileId;
    const requestId = req.params.reqid;

    const response: ResponseType = await menteeService.sessionCreate(
      userId,
      profId,
      requestId
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("userProfile Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const EditSessionAvailability = async (req: Request, res: Response) => {
  try {
    const profId = req.auth.profileId;

    const editData: editAvailbilitykDto = req.body;

    editAvailbilitykDto.parse(editData)

    const response: ResponseType = await menteeService.editAvailbility(
      editData,
      profId,
    );

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("EditSessionAvailability Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

export const mentorProfile = async (req: Request, res: Response) => {
  try {
    const mentorId = req.auth.id;

    const response: ResponseType = await menteeService.getMentorProfile(mentorId);

    res.status(response.status_code).json(response);
  } catch (error: any) {
    console.error("userProfile Error:", error.message);
    CONTROLLER_ERROR(res, error);
  }
};

