import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/jobs — fetch all open jobs
router.get("/", async (req, res) => {
  try {
    const { search, category, type, location } = req.query;

    const filter = { status: "Open" };

    if (search?.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { company: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category?.trim()) {
      filter.category = {
        $regex: category.trim(),
        $options: "i",
      };
    }

    if (type?.trim()) {
      filter.type = type.trim();
    }

    if (location?.trim()) {
      filter.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    const jobs = await Job.find(filter)
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Fetch jobs error:", error.message);
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id — fetch one job by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findOne({ _id: id, status: "Open" })
      .populate("postedBy", "name");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error("Fetch job error:", error.message);
    return res.status(500).json({ message: "Failed to fetch job" });
  }
});


/* PUT /api/jobs/:id — update a job owned by the logged-in user */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Find the job and verify ownership
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own job posts",
      });
    }

    const allowedFields = [
      "title",
      "company",
      "location",
      "category",
      "type",
      "salary",
      "description",
      "requirements",
      "skills",
      "deadline",
      "status",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        job.set(field, req.body[field]);
      }
    }

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Update job error:", error.message);
    return res.status(500).json({
      message: "Failed to update job",
    });
  }
});


/* DELETE /api/jobs/:id — delete a job owned by the logged-in user */
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own job posts",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error.message);
    return res.status(500).json({
      message: "Failed to delete job",
    });
  }
});


export default router;
// POST /api/jobs — create a job (login required)
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      category,
      type,
      salary,
      description,
      requirements,
      skills,
      deadline,
    } = req.body;

    // Check required fields
    if (
      !title?.trim() ||
      !company?.trim() ||
      !location?.trim() ||
      !category?.trim() ||
      !type ||
      !description?.trim()
    ) {
      return res.status(400).json({
        message:
          "Title, company, location, category, type, and description are required",
      });
    }

    // Create the job and link it to the logged-in user
    const job = await Job.create({
      title,
      company,
      location,
      category,
      type,
      salary,
      description,
      requirements,
      skills,
      deadline,
      postedBy: req.user._id,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Create job error:", error.message);
    return res.status(500).json({
      message: "Failed to create job",
    });
  }
});