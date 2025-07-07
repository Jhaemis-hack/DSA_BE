import auth_N from "../../middlewares/Auth_N";
import express from "express";
import { addNewUser, editUserProfile, fetchAllUsers, upgradeRole } from "./admin.controller";
import auth_Z from "../../middlewares/Auth_Z";

const AdminRouter = express.Router();


// Admin: view all users
AdminRouter.get("/users", auth_N, auth_Z("admin"), fetchAllUsers);

// Admin: Update user role (e.g., promote to mentor)
AdminRouter.put("/users/:id/role", auth_N, auth_Z("admin"), upgradeRole);

// Admin: add new user
AdminRouter.post("/users/register", auth_N, auth_Z("admin"), addNewUser);

// Admin: edit existing user
AdminRouter.put("/users/:id", auth_N, auth_Z("admin"), editUserProfile);

// // Admin: view all mentee to mentor matching
// AdminRouter.put("/admin/users/:id/role", auth_Z("admin"), userSignUp);

// // Admin: number of sessions held
// AdminRouter.put("/admin/users/:id/role", auth_Z("admin"), userSignUp);

export default AdminRouter;


