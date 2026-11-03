
import express from "express";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/applications/my
// View applications submitted by the logged-in user
router.get("/my", protect, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "job",
        select: "title company location category type salary status",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

// GET /api/applications/received/:jobId
// Employer views applicants for their own job
router.get("/received/:jobId", protect, async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view these applications",
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email skills")
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch received applications",
    });
  }
});

// PATCH /api/applications/:applicationId/status
// Employer updates an applicant's status
router.patch("/:applicationId/status", protect, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Reviewed",
      "Shortlisted",
      "Rejected",
      "Accepted",
    ];

    if (!mongoose.isValidObjectId(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (
      application.job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this application",
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update application status",
    });
  }
});

// POST /api/applications/:jobId
// Apply for an open job
router.post("/:jobId", protect, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body ?? {};

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findOne({
      _id: jobId,
      status: "Open",
    });

    if (!job) {
      return res.status(404).json({
        message: "Open job not found",
      });
    }

    if (job.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot apply to your own job",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Failed to submit application",
    });
  }
});

export default router;
