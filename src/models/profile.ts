import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    username: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    skill: {
      type: Array,
      default: [],
    },
    goals: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false, collection: "Profiles" }
);

const Profiles = mongoose.model("Profiles", profileSchema);
export default Profiles;