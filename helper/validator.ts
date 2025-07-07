import mongoose from "mongoose";
import * as z from "zod/v4";

export const userLoginDto = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type userLoginDto = z.infer<typeof userLoginDto>;


export const userSignUpDto = z.object({
  email: z.string().email("Invalid email format").nonempty(),
  password: z.string().min(6, "Password must be at least 6 characters long").nonempty(),
  role: z.string().optional(),
});
export type userSignUpDto = z.infer<typeof userSignUpDto>;


export const profileUpdateDto = z.object({
  username: z.string().nonempty("Username cannot be empty"),
  bio: z.string().nonempty("Include a description of your self for proper mentor matching."),
  skill: z.array(z.string()).optional(),
  goals: z.string().nonempty("Include your goals for proper mentor matching."),
});
export type profileUpdateDto = z.infer<typeof profileUpdateDto>;

export type mongoIdType = z.infer<typeof mongoose.Types.ObjectId>;

export interface ResponseType {
  status_code: number;
  message: string;
  data: any;
}

export const menteeProfileUpdateDto = z.object({
  bio: z.string().optional(),
  skill: z.array(z.string()).optional(),
  goals: z.string().optional(),
});
export type menteeProfileUpdateDto = z.infer<typeof menteeProfileUpdateDto>;


export const adminAssignRoleDto = z.object({
  role: z.string().nonempty()
});
export type adminAssignRoleDto = z.infer<typeof adminAssignRoleDto>;

export const FeedBackDto = z.object({
  feedback: z.string().nonempty(),
  rating: z.number().min(1).max(5),
});
export type FeedBackDto = z.infer<typeof FeedBackDto>;

export const editAvailbilitykDto = z.object({
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});
export type editAvailbilitykDto = z.infer<typeof editAvailbilitykDto>;

export const createAvailbilitykDto = z.object({
  date: z.string().nonempty(),
  startTime: z.string().nonempty(),
  endTime: z.string().nonempty(),
});
export type createAvailbilitykDto = z.infer<typeof createAvailbilitykDto>;

export const createSessionDto = z.object({
  date: z.string().nonempty(),
});
export type createSessionDto = z.infer<typeof createSessionDto>;

export interface FeedBackPayload {
  sessionId: mongoIdType,
  menteeId: string,
  profId: string,
  feedback: string,
  rating: number,
}
