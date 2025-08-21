// import { profileUpdate, userLogin, userSignUp } from "./auth.controller";
import express from "express";
import {
  bookMentorSession,
  fetchMentors,
  getMenteeMontorshipRequest,
  getMentorAvailability,
  getRecommendedMentors,
  getUserProfile,
  menteeMentorRequest,
  menteeProfileUpdate,
  menteeSessionFeedback,
  menteeSessions,
  userProfile,
} from "./mentee.controller";
import auth_N from "../../middlewares/Auth_N";
import auth_Z from "../../middlewares/Auth_Z";

const MenteeRouter = express.Router();

// Get the current user’s full profile
MenteeRouter.get("/me", auth_N, userProfile);

// Get another user's profile by ID
MenteeRouter.get("/:id", getUserProfile);

// Update own profile (bio, skills, goals)
MenteeRouter.patch("/me/profile", auth_N, menteeProfileUpdate);

// /mentees/recommendations?skill=JavaScript&industry=Tech
// Update own profile (bio, skills, goals)
MenteeRouter.get("/", auth_N, getRecommendedMentors);

MenteeRouter.get("/mentors/all", auth_N, fetchMentors);

// Mentee sends a mentorship request to a mentor
MenteeRouter.post("/requests/:id", auth_N, menteeMentorRequest);

// Get availability for a mentor by ID
MenteeRouter.get('/:mentorId/availability',  auth_N, getMentorAvailability);

// Book a session
MenteeRouter.post('/session/book/:mentorId',  auth_N, auth_Z("mentee"), bookMentorSession);

// Get all sessions where the current user is the mentee
MenteeRouter.get("/sessions/mentee", auth_N, menteeSessions);

// Submit feedback + rating after the session
MenteeRouter.post("/sessions/:sesid/feedback", auth_N, menteeSessionFeedback);

// View the requests the current mentee has sent
MenteeRouter.get("/requests/sent", auth_N, getMenteeMontorshipRequest);

export default MenteeRouter;
