import auth_N from "../../middlewares/Auth_N";
import { fetchDetailsOfUser, getUser, logOut, profileUpdate, userLogin, userSignUp } from "./auth.controller";
import express from "express";

const AuthRouter = express.Router();

// User login route
AuthRouter.post("/login", userLogin);

// User signup route
AuthRouter.post("/register", userSignUp);

// Profile update route
AuthRouter.put("/profile", auth_N, profileUpdate);

// Profile update route
AuthRouter.get("/logout", auth_N, logOut);

// Profile update route
AuthRouter.get("/me", auth_N, getUser);

AuthRouter.get("/fulldetails", auth_N, fetchDetailsOfUser);

export default AuthRouter;