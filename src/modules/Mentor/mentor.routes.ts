import express from "express";
import auth_N from "../../middlewares/Auth_N";
import { getAvailabilityData, EditSessionAvailability, getMenteeSessions, mentorProfile, updateStatusRequests, viewMentorShipRequests } from "./mentor.controller";
import auth_Z from "../../middlewares/Auth_Z";

const MentorRouter = express.Router();

// View the requests the mentor has received
MentorRouter.get("/requests/received", auth_N, auth_Z("mentor"), viewMentorShipRequests);

// Mentor updates status (ACCEPTED/REJECTED)
MentorRouter.post("/requests/:reqid", auth_N, auth_Z("mentor"), updateStatusRequests);

// Get all sessions where the current user is the mentor
MentorRouter.get("/sessions/mentor", auth_N, auth_Z("mentor"), getMenteeSessions);

// // Schedule a session (after request accepted)
// MentorRouter.post("/sessions/:reqid", auth_N, auth_Z("mentor"), createSession);

// Schedule a session (after request accepted)
MentorRouter.put("/available/edit", auth_N, auth_Z("mentor"), EditSessionAvailability);

MentorRouter.get("/me", auth_N, auth_Z("mentor"), mentorProfile);

MentorRouter.get("/available", auth_N, auth_Z("mentor"), getAvailabilityData);


export default MentorRouter;