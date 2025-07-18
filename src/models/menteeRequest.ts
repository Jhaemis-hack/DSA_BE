import mongoose from "mongoose";

const menteeRequestSchema = new mongoose.Schema(
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
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  { timestamps: true, versionKey: false, collection: "mentorshipRequests" }
);

const mentorShipRequest = mongoose.model("mentorshipRequests", menteeRequestSchema);
export default mentorShipRequest;
