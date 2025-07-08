import express from "express";
import { seedAdminData, seedMenteeData, seedMentorData } from "../controller/user";
import { seedMenteeProfileData } from "../controller/menteeProfile";
import { seedMentorAvailabilityData } from "../controller/mentorAvailability";
import { seedMentorProfileData } from "../controller/mentorProfile";

const seedDataRouter = express.Router();

seedDataRouter.get("/mentee", seedMenteeData);

seedDataRouter.get("/mentor", seedMentorData);

seedDataRouter.get("/admin", seedAdminData);

seedDataRouter.get("/mentee/profile", seedMenteeProfileData);

seedDataRouter.get("/mentor/profile", seedMentorProfileData);

seedDataRouter.get("/mentor/available", seedMentorAvailabilityData);

export default seedDataRouter;