import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mentorProfiles",
      required: true,
    },
    date: {
      type: String,
      default: "",
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false, collection: "availableMentors" }
);

const AvailabilitySchema = mongoose.model("availableMentors", availabilitySchema);
export default AvailabilitySchema;