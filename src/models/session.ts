import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mentorProfiles",
      required: true,
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profiles",
      required: true,
    },
    date: {
      type:String
    },
    feedBack: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    dateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "availableMentors",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true, versionKey: false, collection: "sessions" }
);

const Sessions = mongoose.model("sessions", sessionSchema);
export default Sessions;
