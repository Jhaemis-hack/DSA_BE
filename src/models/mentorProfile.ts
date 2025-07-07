import mongoose from "mongoose";

const mentorProfileSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: {
      type: String,
    },
    skill: {
      type: Array,
      default: [],
    },
    industry: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, versionKey: false, collection: "mentorProfiles" }
);

const mentorProfiles = mongoose.model("mentorProfiles", mentorProfileSchema);
export default mentorProfiles;