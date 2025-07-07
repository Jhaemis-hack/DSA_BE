import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["mentee", "admin", "mentor"],
      default: "mentee",
    },
  },
  { timestamps: true, versionKey: false, collection: "Users" }
);

const User = mongoose.model("Users", userSchema);
export default User;
