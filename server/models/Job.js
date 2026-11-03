import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 100,
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 100,
    },

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      required: [true, "Job category is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      required: [true, "Job type is required"],
    },

    salary: {
      type: String,
      trim: true,
      default: "Negotiable",
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deadline: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;